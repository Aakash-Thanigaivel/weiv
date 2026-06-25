import { motion } from 'framer-motion'

const cinematicEase = [0.22, 1, 0.36, 1]

export default function Footer() {
  return (
    <motion.footer
      id="footer"
      className="relative z-20 overflow-hidden bg-[linear-gradient(180deg,#1a0810_0%,#22070f_60%,#0e0408_100%)] px-6 pb-10 pt-16 text-[#fbf1d4]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: cinematicEase }}
      aria-label="Footer"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(218,192,131,0.55),transparent)]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="font-subheading text-[0.74rem] uppercase tracking-[0.42em] text-[#dac083]">
          With Love &amp; Gratitude
        </p>

        <h3 className="mt-4 font-heading text-[1.9rem] leading-tight text-[#fbf1d4] md:text-[2.4rem]">
          Aakash <span className="text-[#e57373]">❤</span> Viji
        </h3>

        <span
          aria-hidden
          className="mx-auto mt-5 block h-px w-24 bg-[linear-gradient(90deg,transparent,rgba(218,192,131,0.6),transparent)]"
        />

        <p className="mx-auto mt-5 max-w-[28rem] font-subheading text-[0.95rem] leading-relaxed text-[#fbf1d4]/80">
          We look forward to celebrating this beautiful day with you.
        </p>

        <p className="mt-10 font-subheading text-[0.72rem] uppercase tracking-[0.3em] text-[#dac083]/85">
          Crafted with <span className="text-[#e57373]">❤</span> by{' '}
          <a
            href="https://www.velvorastudio.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 transition-colors duration-300 hover:text-[#fbf1d4] hover:underline"
          >
            Velvora Studio
          </a>
        </p>
      </div>
    </motion.footer>
  )
}
