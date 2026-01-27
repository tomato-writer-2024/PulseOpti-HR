'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * 页面性能监控组件
 * 用于跟踪页面加载性能和用户交互
 */
export function PerformanceMonitor() {
  const pathname = usePathname();
  const startTimeRef = useRef<number>(Date.now());
  const renderStartTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // 页面加载完成
    const loadTime = Date.now() - startTimeRef.current;
    console.log(`[Performance] ${pathname} loaded in ${loadTime}ms`);

    // 上报性能数据（生产环境）
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && 'performance' in window) {
      // 这里可以集成性能监控服务
      // 例如：Sentry, Google Analytics, 或自定义监控系统
    }

    // 记录Navigation Timing API数据
    if (typeof window !== 'undefined' && 'performance' in window) {
      const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (perfData) {
        console.log('[Performance Navigation]', {
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
          totalLoadTime: perfData.loadEventEnd - perfData.startTime,
        });
      }
    }

    return () => {
      // 清理和上报
    };
  }, [pathname]);

  useEffect(() => {
    // 组件渲染时间
    const renderTime = Date.now() - renderStartTimeRef.current;
    if (renderTime > 100) {
      console.warn(`[Performance] Slow render detected: ${renderTime}ms for ${pathname}`);
    }

    // 监控内存使用（生产环境）
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
      const memory = (performance as any).memory;
      if (memory) {
        console.log('[Memory]', {
          usedJSHeapSize: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
          totalJSHeapSize: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        });
      }
    }
  }, [pathname]);

  return null;
}

/**
 * 页面预加载组件
 * 用于预加载即将访问的页面资源
 */
export function PagePreloader({ paths }: { paths: string[] }) {
  useEffect(() => {
    // 预加载路由
    if ('serviceWorker' in navigator && 'requestIdleCallback' in window) {
      const callback = () => {
        paths.forEach((path) => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = path;
          document.head.appendChild(link);
        });
      };

      (window as any).requestIdleCallback(callback);
    }
  }, [paths]);

  return null;
}

/**
 * 网络状态监控组件
 */
export function NetworkMonitor({ onOnlineChange, onOfflineChange }: {
  onOnlineChange?: () => void;
  onOfflineChange?: () => void;
}) {
  useEffect(() => {
    const handleOnline = () => {
      console.log('[Network] Online');
      onOnlineChange?.();
    };

    const handleOffline = () => {
      console.warn('[Network] Offline');
      onOfflineChange?.();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onOnlineChange, onOfflineChange]);

  return null;
}

/**
 * 视口可见性监控组件
 * 用于暂停不可见页面的动画和数据更新
 */
export function VisibilityMonitor({ onVisibilityChange }: {
  onVisibilityChange?: (isVisible: boolean) => void;
}) {
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      console.log('[Visibility]', isVisible ? 'Visible' : 'Hidden');
      onVisibilityChange?.(isVisible);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onVisibilityChange]);

  return null;
}

/**
 * 懒加载图片组件
 */
export function LazyImage({
  src,
  alt,
  className,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E',
  ...props
}: Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'placeholder'> & {
  placeholder?: string;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = imgRef.current;
          if (img && src) {
            img.src = typeof src === 'string' ? src : placeholder;
            observer.unobserve(img);
          }
        }
      },
      { threshold: 0.1 }
    );

    const img = imgRef.current;
    if (img) {
      img.src = placeholder;
      observer.observe(img);
    }

    return () => {
      if (img) {
        observer.unobserve(img);
      }
    };
  }, [src, placeholder]);

  const handleLoad = () => setIsLoaded(true);

  return (
    <img
      ref={imgRef}
      alt={alt}
      className={cn('transition-opacity duration-300', isLoaded ? 'opacity-100' : 'opacity-0', className)}
      onLoad={handleLoad}
      {...props}
    />
  );
}

import { cn } from '@/lib/utils';
import { useState } from 'react';
