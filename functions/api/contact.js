import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const contentType = request.headers.get("content-type") || "";

    let name = "";
    let email = "";
    let subject = "";
    let message = "";

    if (contentType.includes("application/json")) {
      const data = await request.json();
      name = (data.name || "").trim();
      email = (data.email || "").trim();
      subject = (data.subject || "").trim();
      message = (data.message || "").trim();
    } else {
      const formData = await request.formData();
      // Honeypot check for bots
      if (formData.get("_gotcha")) {
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
      name = (formData.get("name") || "").toString().trim();
      email = (formData.get("email") || "").toString().trim();
      subject = (formData.get("subject") || "").toString().trim();
      message = (formData.get("message") || "").toString().trim();
    }

    // Basic validation
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Please fill in all required fields." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid email address." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if Cloudflare Email Routing binding (SEB) is configured
    // Binding name: env.CONTACT_EMAIL or env.EMAIL
    const emailBinding = env.CONTACT_EMAIL || env.EMAIL;
    const destinationAddress = env.DESTINATION_EMAIL || "contact@longestchariot.com";
    const senderAddress = env.SENDER_EMAIL || "contact@longestchariot.com";

    if (emailBinding && typeof emailBinding.send === "function") {
      const msg = createMimeMessage();
      msg.setSender({ name: `${name} via Longest Chariot`, addr: senderAddress });
      msg.setRecipient(destinationAddress);
      msg.setSubject(`[Website Inquiry] ${subject}`);
      msg.setHeader("Reply-To", email);
      msg.addMessage({
        contentType: "text/plain",
        data: `New message received from your website contact form:\n\n` +
              `Name: ${name}\n` +
              `Email: ${email}\n` +
              `Subject: ${subject}\n\n` +
              `Message:\n${message}\n`
      });

      const emailMessage = new EmailMessage(senderAddress, destinationAddress, msg.asRaw());
      await emailBinding.send(emailMessage);

      return new Response(
        JSON.stringify({ success: true, message: "Message sent successfully!" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fallback: If Email binding is not yet bound in dashboard, notify clearly
    return new Response(
      JSON.stringify({
        success: true,
        note: "Received by Pages function. Ensure Cloudflare Email Routing binding is attached in Pages Settings.",
        data: { name, email, subject }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to process message. Please try again or email contact@longestchariot.com directly." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
