<script>
    const WA = "6281234567890"; // GANTI dengan nomor WhatsApp (format 62...)
    const P = [
    {n: "Kerupuk Udang Jumbo", s: "250 g", d: "Irisan lebar dan tebal, mengembang besar saat digoreng.", f: ["Renyah dan ringan", "Rasa udang gurih", "Tanpa gluten"] },
    {n: "Kerupuk Udang Original", s: "250 g", d: "Rasa udang klasik untuk teman nasi dan soto.", f: ["Gurih seimbang", "Mengembang rata", "Halal"] },
    {n: "Kerupuk Udang Pedas", s: "250 g", d: "Bumbu pedas ringan untuk yang suka nendang.", f: ["Pedas sedang", "Aroma udang kuat", "Praktis digoreng"] },
    {n: "Kerupuk Udang Mini", s: "200 g", d: "Potongan kecil, pas untuk camilan dan topping.", f: ["Mudah dimakan", "Cocok untuk topping", "Renyah"] },
    {n: "Paket Hemat 4 Kemasan", s: "4 × 250 g", d: "Stok untuk sebulan atau untuk dijual kembali.", f: ["Lebih hemat", "Harga reseller", "Kirim ke seluruh Indonesia"] }];
        let i = 0; const $ = id => document.getElementById(id);
        const link = t => "https://wa.me/" + WA + "?text=" + encodeURIComponent(t);
        document.querySelectorAll(".wa").forEach(a => a.href = link("Halo Putri Indrasari, saya mau pesan kerupuk udang."));
    $("wa2").href = link("Halo, saya mau tanya lokasi toko.");
        $("tabs").innerHTML = P.map((p, k) => `<button role="tab" data-k="${k}">${p.n}</button>`).join("");
    function show(k) {
        i = (k + P.length) % P.length; const p = P[i];
    $("pn").textContent = p.n; $("pd").textContent = p.d; $("ps").textContent = p.s;
            $("pf").innerHTML = p.f.map(x => `<li>${x}</li>`).join("");
    $("pb").href = link(`Halo, saya mau pesan ${p.n} (${p.s}).`);
            document.querySelectorAll("#tabs button").forEach((b, k) => b.setAttribute("aria-current", k === i));
    if (window.gsap) gsap.fromTo("#pi", {y: 20, opacity: .3 }, {y: 0, opacity: 1, duration: .4 });
        }
        $("prev").onclick = () => show(i - 1); $("next").onclick = () => show(i + 1);
        $("tabs").onclick = e => { const b = e.target.closest("button"); if (b) show(+b.dataset.k) };
    show(0);
    const t = "Renyah · Gurih · Langsung Digoreng · "; $("mq").textContent = t.repeat(10);
    if (window.gsap && !matchMedia("(prefers-reduced-motion:reduce)").matches) gsap.from("#pack", {y: 160, opacity: 0, duration: 1.1, ease: "power3.out", delay: .15 });
    if (window.Lenis && !matchMedia("(prefers-reduced-motion:reduce)").matches) { const l = new Lenis(); (function r(t) {l.raf(t); requestAnimationFrame(r) })(0) }
</script>
