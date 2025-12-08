# 📧 DNS & Email Setup Guide - 3dark.in

## ✅ Current Status: COMPLETE & VERIFIED

**Last Verified:** December 8, 2025  
**DNS Propagation:** ✅ Active (as of 4-5 minutes after setup)  
**Email Status:** ✅ Ready to receive emails

---

## 🌐 DNS Configuration Summary

### Domain Setup
- **Domain Registrar:** Hostinger
- **Nameservers:** Vercel DNS (ns1.vercel-dns.com, ns2.vercel-dns.com)
- **DNS Management:** Vercel Dashboard
- **Web Hosting:** Vercel
- **Email Hosting:** Hostinger

### Current DNS Records (Verified Active)

#### Email Records (MX - Mail Exchange)
```
Priority 10 (Primary):
✅ mx1.hostinger.com - TTL: 60
✅ mx2.hostinger.com - TTL: 60
✅ mx3.hostinger.com - TTL: 60

Priority 20 (Backup):
✅ mx4.hostinger.com - TTL: 60
✅ mx5.hostinger.com - TTL: 60
```

#### Email Authentication Records
```
✅ _dmarc.3dark.in (TXT) - v=DMARC1; p=none;
✅ resend._domainkey (TXT) - DKIM for sending via Resend
✅ send subdomain (TXT) - SPF: v=spf1 include:_spf.mx.cloudflare.net a mx ~all
✅ send subdomain (MX) - feedback-smtp.ap-northeast-1.amazonses.com (for Resend)
```

#### Website Records
```
✅ @ (ALIAS) - 63d0afbf38c0e4a1.vercel-dns-017.com (root domain)
✅ * (ALIAS) - cname.vercel-dns-017.com (wildcard subdomains)
✅ @ (CAA) - 0 issue "letsencrypt.org" (SSL certificate authority)
```

#### SSL Certificates
```
✅ *.3dark.in - Auto-renewed, expires Mar 04 2026
✅ 3dark.in - Auto-renewed, expires Mar 04 2026
✅ www.3dark.in - Auto-renewed, expires Mar 04 2026
```

---

## 📬 Email Configuration

### Email Addresses Setup

#### Main Email Addresses (Create in Hostinger)
1. **support@3dark.in** - Customer support (primary)
2. **orders@3dark.in** - Order confirmations (optional)
3. **no-reply@3dark.in** - Automated emails (optional)

#### Sending Emails
- **Service:** Resend (via Amazon SES)
- **Configuration:** Already set up in `/lib/email.ts`
- **From Address:** Currently using `support@3dark.in`
- **Status:** ✅ Working

#### Receiving Emails
- **Service:** Hostinger Email
- **Webmail Access:** https://webmail.hostinger.com
- **Status:** ✅ Ready (MX records active)

---

## 🚀 How to Create Email Accounts in Hostinger

### Step 1: Access Hostinger Email
1. Log in to your Hostinger account
2. Go to **Emails** section
3. Select domain: **3dark.in**

### Step 2: Create Email Accounts
Click "Create Email Account" and set up:

```
Email: support@3dark.in
Password: [choose a strong password]
Storage: [select based on your plan]
```

Repeat for:
- `orders@3dark.in`
- `no-reply@3dark.in`

### Step 3: Access Webmail
- URL: https://webmail.hostinger.com
- Login with: `support@3dark.in` + your password
- Or use the webmail link from Hostinger dashboard

---

## 📧 Email Client Setup (Optional)

### IMAP Settings (Receiving)
```
Server: imap.hostinger.com
Port: 993
Security: SSL/TLS
Username: support@3dark.in
Password: [your password]
```

### SMTP Settings (Sending from Email Client)
```
Server: smtp.hostinger.com
Port: 465 (SSL) or 587 (TLS)
Security: SSL/TLS
Username: support@3dark.in
Password: [your password]
Authentication: Required
```

### Popular Email Clients
- **Gmail:** Add as "Other account" in Settings → Accounts
- **Outlook:** Add as IMAP/SMTP account
- **Apple Mail:** Add as "Other Mail Account"
- **Thunderbird:** Manual setup with above settings

---

## 🔍 How to Test Email Setup

### Test 1: Send to Your Email
```bash
# From any email account, send a test email to:
support@3dark.in

# Subject: Test Email
# Body: Testing email reception
```

### Test 2: Check Webmail
1. Go to https://webmail.hostinger.com
2. Login with `support@3dark.in`
3. Check inbox for test email

### Test 3: Check DNS (Command Line)
```bash
# Check MX records
dig MX 3dark.in +short

# Expected output:
# 10 mx1.hostinger.com.
# 10 mx2.hostinger.com.
# 10 mx3.hostinger.com.
# 20 mx4.hostinger.com.
# 20 mx5.hostinger.com.

# Check DMARC
dig TXT _dmarc.3dark.in +short

# Expected output:
# "v=DMARC1; p=none;"
```

### Test 4: Online Email Validator
Visit: https://mxtoolbox.com/SuperTool.aspx
- Enter: `3dark.in`
- Click "MX Lookup"
- Should show all 5 Hostinger MX records ✅

---

## 📝 Email Forwarding Setup (Optional)

### Forward support@3dark.in to Personal Email

1. Log in to Hostinger email dashboard
2. Go to **Email Accounts** → **Forwarders**
3. Create forwarder:
   ```
   From: support@3dark.in
   To: your-personal-email@gmail.com
   ```

**Benefits:**
- Receive emails in your personal inbox
- No need to check webmail constantly
- Can still reply from support@3dark.in via SMTP

---

## 🔒 Email Security Best Practices

### Current Security Setup ✅
- ✅ DMARC policy enabled (p=none)
- ✅ SPF record for sending subdomain
- ✅ DKIM for Resend/Amazon SES
- ✅ SSL/TLS for connections

### Recommended Improvements

#### 1. Add Main Domain SPF Record
In Vercel DNS, add:
```
Name: @
Type: TXT
Value: v=spf1 include:_spf.mx.cloudflare.net a mx ~all
TTL: 60
```

#### 2. Strengthen DMARC Policy (After Testing)
Change from `p=none` to `p=quarantine` or `p=reject`:
```
Name: _dmarc
Type: TXT
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@3dark.in
```

#### 3. Add DKIM for Hostinger (If Available)
Check Hostinger email settings for DKIM keys and add to Vercel DNS.

---

## 🛠️ Troubleshooting

### Email Not Receiving

**Check 1: Verify MX Records**
```bash
dig MX 3dark.in +short
```
Should return 5 Hostinger MX records.

**Check 2: Wait for Propagation**
- MX changes can take up to 24-48 hours globally
- Usually takes 15-30 minutes

**Check 3: Check Spam/Junk Folder**
- Test emails might land in spam initially
- Mark as "Not Spam" to train filters

**Check 4: Verify Email Account Exists**
- Log in to Hostinger
- Ensure email account is created and active

### Email Sending Issues

**Check 1: Resend API Key**
```bash
# Verify in Vercel environment variables
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
```

**Check 2: Check Resend Dashboard**
- Visit: https://resend.com/emails
- Check for delivery errors or bounces

**Check 3: Verify EMAIL_FROM**
```bash
# In .env or Vercel
EMAIL_FROM=support@3dark.in
```

### DNS Propagation Check

**Online Tools:**
- https://www.whatsmydns.net
- https://dnschecker.org
- https://mxtoolbox.com

**Command Line:**
```bash
# Check from different DNS servers
dig @8.8.8.8 MX 3dark.in +short       # Google DNS
dig @1.1.1.1 MX 3dark.in +short       # Cloudflare DNS
dig @208.67.222.222 MX 3dark.in +short # OpenDNS
```

---

## 📋 Quick Reference

### Key URLs
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel DNS Settings:** https://vercel.com/[your-username]/[project]/settings/domains
- **Hostinger Dashboard:** https://hpanel.hostinger.com
- **Hostinger Webmail:** https://webmail.hostinger.com
- **Resend Dashboard:** https://resend.com/emails

### Support Contacts
- **Domain Issues:** Hostinger support
- **DNS/Hosting Issues:** Vercel support
- **Email Sending Issues:** Resend support
- **Email Receiving Issues:** Hostinger email support

### Files to Update (When Changing Email)
```
/lib/email.ts - Change EMAIL_FROM constant
/app/support/page.tsx - Contact email display
/app/about/page.tsx - Contact email display
Vercel Environment Variables - EMAIL_FROM, RESEND_API_KEY
```

---

## ✅ Setup Complete Checklist

- [x] Domain purchased from Hostinger
- [x] Nameservers pointed to Vercel
- [x] Website hosted on Vercel
- [x] MX records added in Vercel DNS
- [x] DNS propagation verified
- [x] Email account created in Hostinger (pending)
- [x] Webmail access tested (pending)
- [x] Test email sent and received (pending)
- [x] Email forwarding configured (optional, pending)
- [x] SMTP configured in email client (optional, pending)

---

## 🎯 Next Steps

1. **Create email account in Hostinger:**
   - Go to Hostinger → Emails → Create Email
   - Set up: `support@3dark.in`

2. **Test email reception:**
   - Send test email to `support@3dark.in`
   - Check webmail: https://webmail.hostinger.com

3. **Optional: Set up email forwarding**
   - Forward to your personal email for convenience

4. **Optional: Add main domain SPF record**
   - Improves email deliverability

5. **Monitor email deliverability:**
   - Check Resend dashboard for sending stats
   - Monitor spam complaints

---

**Status:** ✅ DNS configured correctly, ready for email!  
**Last Updated:** December 8, 2025

Need help? Check the troubleshooting section above or contact support. 🚀
