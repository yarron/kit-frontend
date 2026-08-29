import Link from "next/link";

import styles from "./Shell.module.css";

/**
 * Серверный компонент: ни состояния, ни обработчиков — значит и JS в браузер
 * отправлять нечего. `"use client"` ставится там, где он ДЕЙСТВИТЕЛЬНО нужен,
 * а не на всё подряд «чтобы работало».
 */
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <span className={styles.brand}>Starter</span>
        <nav className={styles.nav}>
          <Link href="/">Обзор</Link>
          <Link href="/orders">Заказы</Link>
        </nav>
      </header>
      {children}
      <footer className={styles.footer}>
        Данные идут через <code>/api/graphql</code> — браузер не знает адреса
        бэкенда.
      </footer>
    </div>
  );
}
