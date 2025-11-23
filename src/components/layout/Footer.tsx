import Link from "next/link";
import { Home } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-muted border-t">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Home className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-lg">HomeStay</span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Nền tảng tìm kiếm nhà ở hàng đầu Việt Nam.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Liên kết</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Trang chủ</Link></li>
                            <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">Giới thiệu</Link></li>
                            <li><Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Liên hệ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Hỗ trợ</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">Trợ giúp</Link></li>
                            <li><Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
                            <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Bảo mật</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Liên hệ</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>📧 contact@homestay.com</p>
                            <p>📞 1800-1234</p>
                            <p>🏢 Hà Nội, Việt Nam</p>
                        </div>
                    </div>

                </div>

                <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; 2024 HomeStay. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    );
}
