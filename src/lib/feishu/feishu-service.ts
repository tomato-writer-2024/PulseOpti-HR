/**
 * 飞书集成服务
 * 提供飞书单点登录、用户同步、消息通知、审批流集成等功能
 */

import { feishuClient, FeishuUser } from './feishu-client';
import { db } from '@/lib/db';
import { users, departments } from '@/storage/database/shared/schema';
import { eq, and, or } from 'drizzle-orm';
import { encryptionService } from '@/lib/encryption-service';

export interface FeishuSyncOptions {
  syncDepartments?: boolean;
  syncUsers?: boolean;
  departmentId?: string;
  forceSync?: boolean;
  companyId?: string; // 企业ID，同步部门和用户时必填
}

export interface FeishuSyncResult {
  departments: {
    created: number;
    updated: number;
    skipped: number;
  };
  users: {
    created: number;
    updated: number;
    skipped: number;
  };
  errors: Array<{
    type: string;
    id: string;
    message: string;
  }>;
}

export interface FeishuSSOUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  openId: string;
  unionId: string;
}

export class FeishuService {
  /**
   * 飞书单点登录 - 通过授权码获取用户
   */
  async ssoLogin(code: string): Promise<FeishuSSOUser> {
    const feishuUser = await feishuClient.getUserInfoByCode(code);

    // 检查用户是否存在（通过email或username）
    // 注意：users表没有openId和unionId字段，暂时使用email匹配
    const existingUser = await db.query.users.findFirst({
      where: or(
        eq(users.email, feishuUser.email || ''),
        eq(users.username, feishuUser.userId)
      ),
    });

    if (!existingUser) {
      // 创建新用户（只使用users表实际存在的字段）
      const newUser = await db.insert(users).values({
        name: feishuUser.name,
        email: feishuUser.email || `${feishuUser.userId}@feishu.com`,
        username: feishuUser.userId,
        avatarUrl: feishuUser.avatar,
        role: 'employee',
        isActive: true,
        userType: 'employee',
        // 将openId和unionId存储在metadata中
        metadata: {
          feishu: {
            openId: feishuUser.openId,
            unionId: feishuUser.unionId,
            userId: feishuUser.userId,
          },
        },
      }).returning();

      return {
        id: newUser[0].id,
        name: newUser[0].name,
        email: newUser[0].email || '',
        avatar: newUser[0].avatarUrl || '',
        openId: feishuUser.openId,
        unionId: feishuUser.unionId,
      };
    }

    // 更新用户信息
    await db.update(users).set({
      name: feishuUser.name,
      email: feishuUser.email || existingUser.email,
      avatarUrl: feishuUser.avatar || existingUser.avatarUrl,
      lastLoginAt: new Date(),
      metadata: {
        ...(existingUser.metadata as any),
        feishu: {
          openId: feishuUser.openId,
          unionId: feishuUser.unionId,
          userId: feishuUser.userId,
        },
      },
    }).where(eq(users.id, existingUser.id));

    // 从metadata中获取openId和unionId
    const feishuMeta = (existingUser.metadata as any)?.feishu || {};

    return {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email || '',
      avatar: existingUser.avatarUrl || '',
      openId: feishuMeta.openId || feishuUser.openId,
      unionId: feishuMeta.unionId || feishuUser.unionId,
    };
  }

  /**
   * 获取OAuth授权URL
   */
  getAuthUrl(redirectUri: string, state?: string): string {
    return feishuClient.getAuthUrl(redirectUri, state);
  }

  /**
   * 同步飞书用户和部门
   */
  async syncFromFeishu(options: FeishuSyncOptions = {}): Promise<FeishuSyncResult> {
    const result: FeishuSyncResult = {
      departments: { created: 0, updated: 0, skipped: 0 },
      users: { created: 0, updated: 0, skipped: 0 },
      errors: [],
    };

    try {
      // 同步部门
      if (options.syncDepartments !== false) {
        await this.syncDepartments(result, options);
      }

      // 同步用户
      if (options.syncUsers !== false) {
        await this.syncUsers(result, options);
      }

      return result;
    } catch (error) {
      result.errors.push({
        type: 'system',
        id: 'sync',
        message: error instanceof Error ? error.message : '未知错误',
      });
      return result;
    }
  }

  /**
   * 同步部门
   */
  private async syncDepartments(result: FeishuSyncResult, options: FeishuSyncOptions): Promise<void> {
    try {
      // 获取飞书部门列表（根部门）
      const departmentsData = await feishuClient.getDepartmentUsers('0');

      if (!options.companyId) {
        throw new Error('companyId is required for department sync');
      }

      for (const dept of departmentsData.users) {
        try {
          const existingDept = await db.query.departments.findFirst({
            where: eq(departments.code, dept.userId),
          });

          if (!existingDept) {
            // 创建新部门
            await db.insert(departments).values({
              name: dept.name,
              code: dept.userId,
              companyId: options.companyId,
              parentId: null,
              managerId: null,
              isActive: true,
            });
            result.departments.created++;
          } else if (options.forceSync) {
            // 更新部门
            await db.update(departments).set({
              name: dept.name,
            }).where(eq(departments.id, existingDept.id));
            result.departments.updated++;
          } else {
            result.departments.skipped++;
          }
        } catch (error) {
          result.errors.push({
            type: 'department',
            id: dept.userId,
            message: error instanceof Error ? error.message : '同步失败',
          });
        }
      }
    } catch (error) {
      result.errors.push({
        type: 'system',
        id: 'departments',
        message: error instanceof Error ? error.message : '获取部门列表失败',
      });
    }
  }

  /**
   * 同步用户
   */
  private async syncUsers(result: FeishuSyncResult, options: FeishuSyncOptions): Promise<void> {
    try {
      // 如果指定了部门ID，只同步该部门用户
      if (options.departmentId) {
        const usersData = await feishuClient.getDepartmentUsers(options.departmentId);
        await this.syncUsersFromList(usersData.users, result, options);

        // 处理分页
        while (usersData.hasMore && usersData.pageToken) {
          const nextPage = await feishuClient.getDepartmentUsers(
            options.departmentId,
            50,
            usersData.pageToken
          );
          await this.syncUsersFromList(nextPage.users, result, options);
          usersData.pageToken = nextPage.pageToken;
          usersData.hasMore = nextPage.hasMore;
        }
      } else {
        // 同步所有用户（通过搜索）
        let pageToken: string | undefined;
        do {
          // 飞书API限制，使用搜索来获取所有用户
          const usersData = await feishuClient.getDepartmentUsers('0');
          await this.syncUsersFromList(usersData.users, result, options);

          if (!usersData.hasMore || !usersData.pageToken) {
            break;
          }
          pageToken = usersData.pageToken;
        } while (pageToken);
      }
    } catch (error) {
      result.errors.push({
        type: 'system',
        id: 'users',
        message: error instanceof Error ? error.message : '获取用户列表失败',
      });
    }
  }

  /**
   * 同步用户列表
   */
  private async syncUsersFromList(feishuUsers: FeishuUser[], result: FeishuSyncResult, options: FeishuSyncOptions): Promise<void> {
    if (!options.companyId) {
      throw new Error('companyId is required for user sync');
    }

    for (const feishuUser of feishuUsers) {
      try {
        // 通过email或username查找用户（users表没有openId和unionId字段）
        const existingUser = await db.query.users.findFirst({
          where: or(
            eq(users.email, feishuUser.email || ''),
            eq(users.username, feishuUser.userId)
          ),
        });

        if (!existingUser) {
          // 创建新用户（使用正确的字段）
          await db.insert(users).values({
            companyId: options.companyId,
            name: feishuUser.name,
            email: feishuUser.email || `${feishuUser.userId}@feishu.com`,
            username: feishuUser.userId,
            avatarUrl: feishuUser.avatar,
            phone: feishuUser.mobile ? encryptionService.encrypt(feishuUser.mobile) : null,
            role: 'employee',
            isActive: feishuUser.status === 1,
            userType: 'employee',
            // 将openId和unionId存储在metadata中
            metadata: {
              feishu: {
                openId: feishuUser.openId,
                unionId: feishuUser.unionId,
                userId: feishuUser.userId,
                position: feishuUser.position,
              },
            },
            createdAt: new Date(),
          });
          result.users.created++;
        } else if (options.forceSync) {
          // 更新用户信息（使用正确的字段）
          await db.update(users).set({
            name: feishuUser.name,
            email: feishuUser.email || existingUser.email,
            avatarUrl: feishuUser.avatar || existingUser.avatarUrl,
            phone: feishuUser.mobile ? encryptionService.encrypt(feishuUser.mobile) : existingUser.phone,
            isActive: feishuUser.status === 1,
            metadata: {
              ...(existingUser.metadata as any),
              feishu: {
                openId: feishuUser.openId,
                unionId: feishuUser.unionId,
                userId: feishuUser.userId,
                position: feishuUser.position,
              },
            },
          }).where(eq(users.id, existingUser.id));
          result.users.updated++;
        } else {
          result.users.skipped++;
        }
      } catch (error) {
        result.errors.push({
          type: 'user',
          id: feishuUser.userId,
          message: error instanceof Error ? error.message : '同步失败',
        });
      }
    }
  }

  /**
   * 发送文本消息通知
   */
  async sendNotification(userId: string, message: string): Promise<void> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    // 从metadata中获取openId
    const openId = (user?.metadata as any)?.feishu?.openId;

    if (!openId) {
      throw new Error('用户未绑定飞书账号');
    }

    await feishuClient.sendTextMessage(openId, message);
  }

  /**
   * 发送卡片消息通知
   */
  async sendCardNotification(userId: string, card: any): Promise<void> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    // 从metadata中获取openId
    const openId = (user?.metadata as any)?.feishu?.openId;

    if (!openId) {
      throw new Error('用户未绑定飞书账号');
    }

    await feishuClient.sendCardMessage(openId, card);
  }

  /**
   * 发送审批通知
   */
  async sendApprovalNotification(userId: string, approvalData: {
    title: string;
    content: string;
    url?: string;
    actions?: Array<{
      text: string;
      url: string;
    }>;
  }): Promise<void> {
    const card = {
      config: {
        wide_screen_mode: true,
      },
      header: {
        template: 'blue',
        title: {
          content: approvalData.title,
          tag: 'plain_text',
        },
      },
      elements: [
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: approvalData.content,
          },
        },
      ],
    };

    // 添加操作按钮
    if (approvalData.actions && approvalData.actions.length > 0) {
      (card.elements as any[]).push({
        tag: 'action',
        actions: approvalData.actions.map(action => ({
          tag: 'button',
          text: {
            tag: 'plain_text',
            content: action.text,
          },
          url: action.url,
          type: 'primary',
        })),
      });
    }

    await this.sendCardNotification(userId, card);
  }

  /**
   * 创建飞书审批实例
   */
  async createApproval(userId: string, approvalCode: string, formData: any): Promise<{
    instanceCode: string;
    url: string;
  }> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    // 从metadata中获取openId
    const openId = (user?.metadata as any)?.feishu?.openId;

    if (!openId) {
      throw new Error('用户未绑定飞书账号');
    }

    return await feishuClient.createApprovalInstance({
      approvalCode,
      form: {
        ...formData,
        user_id: openId,
      },
    });
  }

  /**
   * 解除用户飞书绑定
   */
  async unlinkFeishu(userId: string): Promise<void> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (user) {
      // 从metadata中移除飞书信息
      const metadata = (user.metadata as any) || {};
      delete metadata.feishu;

      await db.update(users).set({
        metadata,
      }).where(eq(users.id, userId));
    }
  }

  /**
   * 搜索飞书用户
   */
  async searchFeishuUsers(query: string): Promise<FeishuUser[]> {
    return await feishuClient.searchUsers(query);
  }

  /**
   * 验证飞书事件请求
   */
  verifyEventRequest(signature: string, timestamp: string, nonce: string, body: string): boolean {
    return feishuClient.verifyEventRequest(signature, timestamp, nonce, body);
  }

  /**
   * 解密飞书事件数据
   */
  decryptEvent(encrypt: string): any {
    return feishuClient.decryptEvent(encrypt);
  }
}

// 导出单例
export const feishuService = new FeishuService();
