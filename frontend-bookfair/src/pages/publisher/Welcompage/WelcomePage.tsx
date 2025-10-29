import React, { useEffect, useMemo, useRef, useState } from "react";
import "./welcomePage.css";

type WelcomePageProps = { brand?: string };
const ROTATE_MS = 8000; // change interval

const WelcomePage: React.FC<WelcomePageProps> = ({ brand = "BookFair" }) => {
     const images = useMemo(() => {
        const modules = import.meta.glob("/src/assets/bg/*.{png,jpg,jpeg}", {
            eager: true,
            as: "url",
        }) as Record<string, string>;
    
        const urls = Object.values(modules).sort();

        const start = urls.findIndex((u) => /\/6\.(png|jpe?g)$/i.test(u));
        return start > -1 ? [urls[start], ...urls.slice(0, start), ...urls.slice(start + 1)] : urls;
    }, []);

    const [idx, setIdx] = useState(0);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (!images.length) return;
        timerRef.current = window.setInterval(
            () => setIdx((i) => (i + 1) % images.length),
            ROTATE_MS
        );
        return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
    }, [images]);

    const bgUrl = images[idx] ?? "";

    return (
        <div className="page-root">

     
            <div className="bg-stage">
                <div className="bg-layer" style={{ backgroundImage: `url(${bgUrl})` }} />
                <div className="bg-overlay" />
            </div>

   
            <section className="content">
            </section>

            <section id="learn-more" className="info">


                <div className="info-card">
                    <h1 className="title">Colombo International Book Fair</h1>
                    <p className="lead">
                        The Colombo International Book Fair is Sri Lanka’s largest annual publishing event,
                        bringing together readers, authors, publishers, and service providers under one roof.
                        It attracts significant local and international footfall, making it a powerful platform
                        for outreach and sales.
                    </p>
                    <h2 className="subtitle">How it helps vendors</h2>
                    <div className="benefits">
                        The Colombo International Book Fair offers vendors exceptional benefits through extensive
                        visibility, enabling them to reach thousands of targeted visitors over multiple days. It supports
                        direct sales by converting high foot traffic into immediate purchases and pre-orders, while also
                        providing strong opportunities for brand building through book launches, author signings, and
                        promotional activities. Vendors can further expand their professional network by connecting with
                        distributors, educators, libraries, and corporate buyers. In addition, the event offers meaningful
                        insights by allowing vendors to gather real audience feedback and observe emerging market trends
                        firsthand.    </div>

                    <div className="cta-row">
                        <button className="btn-gradient" >
                            Book Tour Stall
                        </button>
                    </div>
                    <div className="info-cardN">

                    </div>
                </div>
            </section>

        </div>
    );
};

export default WelcomePage;
