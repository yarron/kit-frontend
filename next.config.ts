import type { NextConfig } from "next";

/**
 * Заголовки безопасности задаются здесь, а не на краю сети: край можно обойти,
 * запросив origin напрямую, и тогда страница уедет без них.
 *
 * CSP тут намеренно НЕТ. Строгая политика с nonce требует прокладки в рендере,
 * а нестрогая (`unsafe-inline`) — это политика, которая ничего не запрещает
 * и создаёт ощущение защиты. Ставить её осознанно, когда дойдут руки, а не
 * «чтобы было».
 */
const securityHeaders = [
	{ key: "X-Content-Type-Options", value: "nosniff" },
	{ key: "X-Frame-Options", value: "DENY" },
	{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=()",
	},
];

const nextConfig: NextConfig = {
	reactStrictMode: true,
	// Убирает заголовок «X-Powered-By: Next.js» — бесплатная строчка в отчёте
	// сканера и минус одна подсказка о версиях.
	poweredByHeader: false,
	async headers() {
		return [{ source: "/:path*", headers: securityHeaders }];
	},
};

export default nextConfig;
