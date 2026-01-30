'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

export interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  companyId: string;
  companyName?: string;
  role: string;
  permissions?: string[];
  createdAt: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // 确保客户端已挂载
  useEffect(() => {
    setMounted(true);
  }, []);

  // 从 localStorage 读取用户信息和 token
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        setUser(userStr ? JSON.parse(userStr) : null);
        setToken(token);
      } catch (error) {
        console.error('Failed to read from localStorage:', error);
      }
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    setUser(null);
    setToken(null);
    router.push('/login');
  }, [router]);

  const isAuthenticated = mounted && user !== null && token !== null;

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    return user.permissions?.includes(permission) || false;
  }, [user]);

  const hasRole = useCallback((roles: string | string[]): boolean => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  }, [user]);

  return {
    user,
    token,
    isAuthenticated,
    logout,
    hasPermission,
    hasRole,
    mounted,
  };
}

// 服务端认证检查工具
export async function checkAuthOnServer(): Promise<User | null> {
  try {
    const response = await fetch('/api/auth/verify', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const text = await response.text();
    if (!text.trim()) {
      return null;
    }

    const data = JSON.parse(text);
    return data.data || null;
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
}

// 路由保护Hook
export function useRequireAuth(redirectUrl: string = '/login') {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, router, redirectUrl]);

  return { isAuthenticated, user };
}

// 权限保护Hook
export function useRequirePermission(permission: string) {
  const { hasPermission, logout } = useAuth();

  useEffect(() => {
    if (!hasPermission(permission)) {
      logout();
    }
  }, [hasPermission, permission, logout]);

  return hasPermission(permission);
}

// 角色保护Hook
export function useRequireRole(roles: string | string[]) {
  const { hasRole, logout } = useAuth();

  useEffect(() => {
    if (!hasRole(roles)) {
      logout();
    }
  }, [hasRole, roles, logout]);

  return hasRole(roles);
}
