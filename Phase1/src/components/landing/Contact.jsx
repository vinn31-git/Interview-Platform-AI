import { useState } from "react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Send } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="py-24 px-4 bg-card/30">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        <BlurFade>
          <div>
            <p className="text-sm uppercase tracking-widest text-primary mb-3">
              Contact
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get in touch
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Have questions, feedback, or want to collaborate? We'd love
              to hear from you.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@interviewmate.ai</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Built with passion in India</span>
              </div>
            </div>
          </div>
        </BlurFade>

        <BlurFade delay={0.15}>
          {sent ? (
            <div className="p-8 rounded-xl border border-primary/30 bg-primary/5 text-center">
              <p className="text-lg font-semibold text-primary mb-2">
                Message sent!
              </p>
              <p className="text-sm text-muted-foreground">
                We'll get back to you soon.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-6 rounded-xl border border-border bg-card"
            >
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full mt-1 border border-border bg-secondary/40 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full mt-1 border border-border bg-secondary/40 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full mt-1 border border-border bg-secondary/40 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
              <Button type="submit" className="w-full gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </form>
          )}
        </BlurFade>
      </div>
    </section>
  );
};

export default Contact;
