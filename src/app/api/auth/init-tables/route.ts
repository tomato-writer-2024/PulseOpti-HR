import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { sql } from 'drizzle-orm';

/**
 * 初始化缺失的数据库表
 * 用于紧急修复：创建 verification_codes 表，添加 subscriptions.user_id 字段
 */
export async function POST() {
  try {
    console.log('开始初始化缺失的数据库表...');

    // 1. 删除旧表（如果存在）
    await db.execute(sql`DROP TABLE IF EXISTS verification_codes CASCADE;`);

    // 2. 创建 verification_codes 表（使用正确的schema）
    await db.execute(sql`
      CREATE TABLE verification_codes (
        id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
        identifier VARCHAR(255) NOT NULL,
        code VARCHAR(10) NOT NULL,
        purpose VARCHAR(20) NOT NULL,
        type VARCHAR(20) NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        used_at TIMESTAMP WITH TIME ZONE,
        ip_address VARCHAR(50),
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    // 3. 添加索引
    await db.execute(sql`
      CREATE INDEX verification_codes_identifier_purpose_idx ON verification_codes(identifier, purpose);
    `);
    await db.execute(sql`
      CREATE INDEX verification_codes_expires_at_idx ON verification_codes(expires_at);
    `);

    // 3. 添加缺失字段到 subscriptions 表
    // user_id
    await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='subscriptions' AND column_name='user_id'
        ) THEN
          ALTER TABLE subscriptions ADD COLUMN user_id VARCHAR(36);
        END IF;
      END $$;
    `);

    // is_trial
    await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='subscriptions' AND column_name='is_trial'
        ) THEN
          ALTER TABLE subscriptions ADD COLUMN is_trial BOOLEAN DEFAULT false;
        END IF;
      END $$;
    `);

    // trial_ends_at
    await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='subscriptions' AND column_name='trial_ends_at'
        ) THEN
          ALTER TABLE subscriptions ADD COLUMN trial_ends_at TIMESTAMP WITH TIME ZONE;
        END IF;
      END $$;
    `);

    // trial_days_remaining
    await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='subscriptions' AND column_name='trial_days_remaining'
        ) THEN
          ALTER TABLE subscriptions ADD COLUMN trial_days_remaining INTEGER DEFAULT 0;
        END IF;
      END $$;
    `);

    // has_trial_used
    await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='subscriptions' AND column_name='has_trial_used'
        ) THEN
          ALTER TABLE subscriptions ADD COLUMN has_trial_used BOOLEAN DEFAULT false;
        END IF;
      END $$;
    `);

    // auto_renew
    await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='subscriptions' AND column_name='auto_renew'
        ) THEN
          ALTER TABLE subscriptions ADD COLUMN auto_renew BOOLEAN DEFAULT false;
        END IF;
      END $$;
    `);

    // metadata
    await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name='subscriptions' AND column_name='metadata'
        ) THEN
          ALTER TABLE subscriptions ADD COLUMN metadata JSONB;
        END IF;
      END $$;
    `);

    // 添加索引
    await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes
          WHERE tablename='subscriptions' AND indexname='idx_subscriptions_user_id'
        ) THEN
          CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
        END IF;
      END $$;
    `);

    console.log('数据库表初始化完成');
    return NextResponse.json({
      success: true,
      message: '数据库表初始化成功'
    });
  } catch (error) {
    console.error('初始化数据库表失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}
