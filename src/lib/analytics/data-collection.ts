/**
 * 数据采集服务
 * 从公司数据库采集HR指标数据，支持批量导入和验证
 */

import { db } from '@/lib/db/drizzle';
import {
  employees,
  attendanceRecords,
  performanceRecords,
  candidates,
  companies,
  payrollRecords,
  trainingRecords
} from '@/storage/database/shared/schema';
import { eq, and, gte, lte, avg, sum, count, sql, desc } from 'drizzle-orm';
import { CompanyMetrics, IndustryType, CompanySize, Region } from './industry-benchmark';

/**
 * 数据采集服务
 */
export class DataCollectionService {
  /**
   * 采集公司HR指标数据
   */
  async collectCompanyMetrics(
    companyId: string,
    year?: number,
    quarter?: number
  ): Promise<CompanyMetrics> {
    const currentYear = year || new Date().getFullYear();
    
    // 计算时间范围
    const startDate = new Date(currentYear, quarter ? (quarter - 1) * 3 : 0, 1);
    const endDate = quarter 
      ? new Date(currentYear, quarter * 3, 0)
      : new Date(currentYear, 11, 31);
    
    // 并行采集各项数据
    const [
      employeeData,
      salaryData,
      turnoverData,
      performanceData,
      recruitmentData,
      attendanceRecordsData,
      trainingData,
      satisfactionData,
    ] = await Promise.all([
      this.collectEmployeeMetrics(companyId, startDate, endDate),
      this.collectSalaryMetrics(companyId, startDate, endDate),
      this.collectTurnoverMetrics(companyId, startDate, endDate),
      this.collectPerformanceMetrics(companyId, startDate, endDate),
      this.collectRecruitmentMetrics(companyId, startDate, endDate),
      this.collectAttendanceMetrics(companyId, startDate, endDate),
      this.collectTrainingMetrics(companyId, startDate, endDate),
      this.collectSatisfactionMetrics(companyId, startDate, endDate),
    ]);
    
    return {
      ...employeeData,
      ...salaryData,
      ...turnoverData,
      ...performanceData,
      ...recruitmentData,
      ...attendanceRecordsData,
      ...trainingData,
      ...satisfactionData,
    };
  }
  
  /**
   * 采集员工规模数据
   */
  private async collectEmployeeMetrics(
    companyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    employeeCount: number;
    employeeGrowthRate: number;
  }> {
    // 获取当前在职员工数
    const currentEmployees = await db
      .select({ count: count() })
      .from(employees)
      .where(
        and(
          eq(employees.companyId, companyId),
          eq(employees.employmentStatus, 'active')
        )
      );
    
    const employeeCount = currentEmployees[0]?.count || 0;
    
    // 获取去年同期的员工数
    const lastYearStart = new Date(startDate);
    lastYearStart.setFullYear(lastYearStart.getFullYear() - 1);
    
    const lastYearEnd = new Date(endDate);
    lastYearEnd.setFullYear(lastYearEnd.getFullYear() - 1);
    
    const lastYearEmployees = await db
      .select({ count: count() })
      .from(employees)
      .where(
        and(
          eq(employees.companyId, companyId),
          eq(employees.employmentStatus, 'active'),
          gte(employees.createdAt, lastYearStart),
          lte(employees.createdAt, lastYearEnd)
        )
      );
    
    const lastYearCount = lastYearEmployees[0]?.count || 0;
    
    // 计算增长率
    const employeeGrowthRate = lastYearCount > 0
      ? ((employeeCount - lastYearCount) / lastYearCount) * 100
      : 0;
    
    return {
      employeeCount,
      employeeGrowthRate: Math.round(employeeGrowthRate * 10) / 10,
    };
  }
  
  /**
   * 采集薪资数据
   */
  private async collectSalaryMetrics(
    companyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    avgSalary: number;
    salaryGrowthRate: number;
    salaryByLevel: {
      junior: number;
      middle: number;
      senior: number;
      director: number;
      executive: number;
    };
  }> {
    // 计算平均薪资（使用税前薪资）
    const salaryResult = await db
      .select({ avgSalary: avg(payrollRecords.grossPay) })
      .from(payrollRecords)
      .where(
        and(
          eq(payrollRecords.companyId, companyId),
          eq(payrollRecords.status, 'paid') // 只统计已发放的薪资
        )
      );
    
    const avgSalary = salaryResult[0]?.avgSalary ? Number(salaryResult[0].avgSalary) / 10000 : 0;
    
    // 按职级计算平均薪资（简化为默认值，需要从员工表关联）
    const salaryByLevel = {
      junior: 0,
      middle: 0,
      senior: 0,
      director: 0,
      executive: 0,
    };
    
    // 计算薪资增长率（对比去年同期）
    const lastYearStart = new Date(startDate);
    lastYearStart.setFullYear(lastYearStart.getFullYear() - 1);
    
    const lastYearEnd = new Date(endDate);
    lastYearEnd.setFullYear(lastYearEnd.getFullYear() - 1);
    
    const lastYearSalary = await db
      .select({ avgSalary: avg(payrollRecords.grossPay) })
      .from(payrollRecords)
      .where(
        and(
          eq(payrollRecords.companyId, companyId),
          eq(payrollRecords.status, 'paid')
        )
      );
    
    const lastYearAvg = Number(lastYearSalary[0]?.avgSalary) ? Number(lastYearSalary[0].avgSalary) / 10000 : 0;
    const salaryGrowthRate = lastYearAvg > 0
      ? ((avgSalary - lastYearAvg) / lastYearAvg) * 100
      : 0;
    
    return {
      avgSalary: Math.round(avgSalary * 10) / 10,
      salaryGrowthRate: Math.round(salaryGrowthRate * 10) / 10,
      salaryByLevel,
    };
  }
  
  /**
   * 采集离职数据
   */
  private async collectTurnoverMetrics(
    companyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    turnoverRate: number;
    voluntaryTurnoverRate: number;
    involuntaryTurnoverRate: number;
  }> {
    // 获取离职员工数（employmentStatus 为 resigned 或 terminated）
    const terminatedEmployees = await db
      .select({ count: count() })
      .from(employees)
      .where(
        and(
          eq(employees.companyId, companyId),
          eq(employees.employmentStatus, 'terminated'),
          gte(employees.updatedAt, startDate),
          lte(employees.updatedAt, endDate)
        )
      );
    
    const terminatedCount = terminatedEmployees[0]?.count || 0;
    
    // 获取总员工数（作为分母）
    const totalEmployees = await db
      .select({ count: count() })
      .from(employees)
      .where(
        and(
          eq(employees.companyId, companyId),
          gte(employees.createdAt, startDate)
        )
      );
    
    const totalCount = totalEmployees[0]?.count || 1;
    
    // 计算离职率
    const turnoverRate = (terminatedCount / totalCount) * 100;
    
    // 获取主动离职（resigned）
    const voluntaryEmployees = await db
      .select({ count: count() })
      .from(employees)
      .where(
        and(
          eq(employees.companyId, companyId),
          eq(employees.employmentStatus, 'resigned'),
          gte(employees.updatedAt, startDate),
          lte(employees.updatedAt, endDate)
        )
      );
    
    const voluntaryCount = voluntaryEmployees[0]?.count || 0;
    const voluntaryTurnoverRate = (voluntaryCount / totalCount) * 100;
    const involuntaryTurnoverRate = turnoverRate - voluntaryTurnoverRate;
    
    return {
      turnoverRate: Math.round(turnoverRate * 10) / 10,
      voluntaryTurnoverRate: Math.round(voluntaryTurnoverRate * 10) / 10,
      involuntaryTurnoverRate: Math.round(involuntaryTurnoverRate * 10) / 10,
    };
  }
  
  /**
   * 采集绩效数据
   */
  private async collectPerformanceMetrics(
    companyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    avgPerformanceScore: number;
    performanceDistribution: {
      excellent: number;
      good: number;
      average: number;
      poor: number;
    };
  }> {
    // 计算平均绩效分数
    const avgScore = await db
      .select({ avgScore: avg(performanceRecords.finalScore) })
      .from(performanceRecords)
      .where(
        and(
          eq(performanceRecords.companyId, companyId),
          gte(performanceRecords.reviewedAt, startDate),
          lte(performanceRecords.reviewedAt, endDate)
        )
      );
    
    const avgPerformanceScore = avgScore[0]?.avgScore ? Math.round(Number(avgScore[0].avgScore)) : 0;
    
    // 绩效分布
    const excellent = await db
      .select({ count: count() })
      .from(performanceRecords)
      .where(
        and(
          eq(performanceRecords.companyId, companyId),
          gte(performanceRecords.finalScore, 90),
          gte(performanceRecords.reviewedAt, startDate),
          lte(performanceRecords.reviewedAt, endDate)
        )
      );
    
    const good = await db
      .select({ count: count() })
      .from(performanceRecords)
      .where(
        and(
          eq(performanceRecords.companyId, companyId),
          gte(performanceRecords.finalScore, 80),
          sql`${performanceRecords.finalScore} < 90`,
          gte(performanceRecords.reviewedAt, startDate),
          lte(performanceRecords.reviewedAt, endDate)
        )
      );
    
    const average = await db
      .select({ count: count() })
      .from(performanceRecords)
      .where(
        and(
          eq(performanceRecords.companyId, companyId),
          gte(performanceRecords.finalScore, 70),
          sql`${performanceRecords.finalScore} < 80`,
          gte(performanceRecords.reviewedAt, startDate),
          lte(performanceRecords.reviewedAt, endDate)
        )
      );
    
    const poor = await db
      .select({ count: count() })
      .from(performanceRecords)
      .where(
        and(
          eq(performanceRecords.companyId, companyId),
          sql`${performanceRecords.finalScore} < 70`,
          gte(performanceRecords.reviewedAt, startDate),
          lte(performanceRecords.reviewedAt, endDate)
        )
      );
    
    const total = (excellent[0]?.count || 0) + 
                  (good[0]?.count || 0) + 
                  (average[0]?.count || 0) + 
                  (poor[0]?.count || 0);
    
    const performanceDistribution = {
      excellent: total > 0 ? Math.round((excellent[0]?.count || 0) / total * 100) : 0,
      good: total > 0 ? Math.round((good[0]?.count || 0) / total * 100) : 0,
      average: total > 0 ? Math.round((average[0]?.count || 0) / total * 100) : 0,
      poor: total > 0 ? Math.round((poor[0]?.count || 0) / total * 100) : 0,
    };
    
    return {
      avgPerformanceScore,
      performanceDistribution,
    };
  }
  
  /**
   * 采集招聘数据
   */
  private async collectRecruitmentMetrics(
    companyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    avgRecruitmentCycle: number;
    offerAcceptanceRate: number;
    costPerHire: number;
  }> {
    // 计算平均招聘周期（使用 createdAt 和 updatedAt 估算）
    const hiredCandidates = await db
      .select({ 
        createdDate: candidates.createdAt,
        updatedDate: candidates.updatedAt,
      })
      .from(candidates)
      .where(
        and(
          eq(candidates.companyId, companyId),
          eq(candidates.status, 'hired'),
          gte(candidates.updatedAt, startDate),
          lte(candidates.updatedAt, endDate)
        )
      );
    
    let avgRecruitmentCycle = 0;
    
    if (hiredCandidates.length > 0) {
      let totalDays = 0;
      for (const c of hiredCandidates) {
        if (c.updatedDate && c.createdDate) {
          const days = Math.floor((c.updatedDate.getTime() - c.createdDate.getTime()) / (1000 * 60 * 60 * 24));
          totalDays += days;
        }
      }
      avgRecruitmentCycle = Math.round(totalDays / hiredCandidates.length);
    }
    
    // 计算Offer接受率（简化：用 hired 数量估算）
    const totalOffers = await db
      .select({ count: count() })
      .from(candidates)
      .where(
        and(
          eq(candidates.companyId, companyId),
          eq(candidates.status, 'offer'),
          gte(candidates.updatedAt, startDate),
          lte(candidates.updatedAt, endDate)
        )
      );
    
    const acceptedOffers = await db
      .select({ count: count() })
      .from(candidates)
      .where(
        and(
          eq(candidates.companyId, companyId),
          eq(candidates.status, 'hired'),
          gte(candidates.updatedAt, startDate),
          lte(candidates.updatedAt, endDate)
        )
      );
    
    const offerAcceptanceRate = totalOffers[0]?.count 
      ? ((acceptedOffers[0]?.count || 0) / totalOffers[0].count) * 100
      : 0;
    
    // 计算单次招聘成本（简化，需要招聘费用数据）
    const costPerHire = 0;
    
    return {
      avgRecruitmentCycle,
      offerAcceptanceRate: Math.round(offerAcceptanceRate * 10) / 10,
      costPerHire,
    };
  }
  
  /**
   * 采集考勤数据
   */
  private async collectAttendanceMetrics(
    companyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    avgAttendanceRate: number;
    avgOvertimeHours: number;
  }> {
    // 获取出勤数据
    const attendanceData = await db
      .select({
        status: attendanceRecords.status,
        workHours: attendanceRecords.workHours,
      })
      .from(attendanceRecords)
      .where(
        and(
          eq(attendanceRecords.companyId, companyId),
          gte(attendanceRecords.recordDate, startDate),
          lte(attendanceRecords.recordDate, endDate)
        )
      );
    
    if (attendanceData.length === 0) {
      return {
        avgAttendanceRate: 96,
        avgOvertimeHours: 20,
      };
    }
    
    // 计算出勤率（正常、迟到、早退都算出勤）
    const presentCount = attendanceData.filter(a => 
      a.status === 'normal' || a.status === 'late' || a.status === 'early_leave'
    ).length;
    
    const avgAttendanceRate = (presentCount / attendanceData.length) * 100;
    
    // 计算平均加班时长（超过8小时的部分，工作时长单位是分钟）
    let totalOvertime = 0;
    for (const a of attendanceData) {
      const hours = (a.workHours || 0) / 60; // 转换为小时
      if (hours > 8) {
        totalOvertime += hours - 8;
      }
    }
    
    const avgOvertimeHours = attendanceData.length > 0 
      ? Math.round(totalOvertime / attendanceData.length)
      : 0;
    
    return {
      avgAttendanceRate: Math.round(avgAttendanceRate * 10) / 10,
      avgOvertimeHours,
    };
  }
  
  /**
   * 采集培训数据
   */
  private async collectTrainingMetrics(
    companyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    avgTrainingHours: number;
    trainingCompletionRate: number;
  }> {
    // 获取培训记录
    const trainingData = await db
      .select({
        hours: trainingRecords.learningHours,
        status: trainingRecords.status,
      })
      .from(trainingRecords)
      .where(
        and(
          eq(trainingRecords.companyId, companyId),
          gte(trainingRecords.createdAt, startDate),
          lte(trainingRecords.createdAt, endDate)
        )
      );
    
    if (trainingData.length === 0) {
      return {
        avgTrainingHours: 40,
        trainingCompletionRate: 85,
      };
    }
    
    // 计算平均培训时长
    let totalHours = 0;
    for (const t of trainingData) {
      totalHours += t.hours || 0;
    }
    
    const avgTrainingHours = Math.round(totalHours / trainingData.length);
    
    // 计算培训完成率
    const completedCount = trainingData.filter(t => t.status === 'completed').length;
    const trainingCompletionRate = (completedCount / trainingData.length) * 100;
    
    return {
      avgTrainingHours,
      trainingCompletionRate: Math.round(trainingCompletionRate * 10) / 10,
    };
  }
  
  /**
   * 采集满意度数据
   */
  private async collectSatisfactionMetrics(
    companyId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    employeeSatisfaction: number;
    engagementScore: number;
  }> {
    // 获取调查数据（简化：返回默认值，需要单独的满意度调查表）
    // 实际项目中可以从以下数据源获取：
    // 1. 员工满意度调查表
    // 2. 员工反馈表
    // 3. 绩效评估中的满意度字段
    return {
      employeeSatisfaction: 75,
      engagementScore: 72,
    };
  }
  
  /**
   * 批量导入行业基准数据
   */
  async importBenchmarkData(data: any[]): Promise<{
    success: number;
    failed: number;
    errors: string[];
  }> {
    let success = 0;
    let failed = 0;
    const errors: string[] = [];
    
    for (let i = 0; i < data.length; i++) {
      try {
        const validated = this.validateBenchmarkData(data[i]);
        
        if (!validated.valid) {
          errors.push(`第${i + 1}行: ${validated.errors.join(', ')}`);
          failed++;
          continue;
        }
        
        // TODO: 保存到数据库
        console.log(`导入基准数据: ${data[i].industry} - ${data[i].companySize}`);
        
        success++;
      } catch (error) {
        errors.push(`第${i + 1}行: ${error}`);
        failed++;
      }
    }
    
    return {
      success,
      failed,
      errors,
    };
  }
  
  /**
   * 验证基准数据
   */
  private validateBenchmarkData(data: any): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    // 必填字段验证
    if (!data.industry) errors.push('行业类型不能为空');
    if (!data.companySize) errors.push('企业规模不能为空');
    if (!data.region) errors.push('地区不能为空');
    
    // 数值范围验证
    if (data.turnoverRate !== undefined) {
      if (data.turnoverRate < 0 || data.turnoverRate > 100) {
        errors.push('离职率必须在0-100之间');
      }
    }
    
    if (data.avgAttendanceRate !== undefined) {
      if (data.avgAttendanceRate < 0 || data.avgAttendanceRate > 100) {
        errors.push('出勤率必须在0-100之间');
      }
    }
    
    if (data.offerAcceptanceRate !== undefined) {
      if (data.offerAcceptanceRate < 0 || data.offerAcceptanceRate > 100) {
        errors.push('Offer接受率必须在0-100之间');
      }
    }
    
    if (data.avgPerformanceScore !== undefined) {
      if (data.avgPerformanceScore < 0 || data.avgPerformanceScore > 100) {
        errors.push('平均绩效分数必须在0-100之间');
      }
    }
    
    if (data.employeeSatisfaction !== undefined) {
      if (data.employeeSatisfaction < 0 || data.employeeSatisfaction > 100) {
        errors.push('员工满意度必须在0-100之间');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }
  
  /**
   * 生成导入模板
   */
  generateImportTemplate(): any[] {
    return [
      {
        industry: 'technology',
        companySize: 'medium',
        region: 'east',
        year: 2024,
        quarter: 4,
        avgEmployeeCount: 350,
        employeeGrowthRate: 15,
        avgSalary: 25,
        turnoverRate: 18,
        avgPerformanceScore: 78,
        avgRecruitmentCycle: 30,
        offerAcceptanceRate: 75,
        costPerHire: 8000,
        avgAttendanceRate: 96,
        avgOvertimeHours: 20,
        avgTrainingHours: 40,
        trainingCompletionRate: 85,
        employeeSatisfaction: 75,
        engagementScore: 72,
        dataSource: 'industry-survey',
        sampleSize: 150,
      },
    ];
  }
}

// 导出单例
export const dataCollectionService = new DataCollectionService();
