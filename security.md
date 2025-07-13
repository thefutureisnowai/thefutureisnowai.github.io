---
layout: default
id: security
title: Security SCS Bham | Freeland
---

## Security

<div class="left-align">
 We look forward to providing you with secure solutions, but since we care deeply about your security, here are a few pieces of advice in the meantime. Don't worry if you don't understand everything. It's a lot to take in. We will be happy to explain anything or assist you with implementing these steps during a consultation or remote service.

<hr>
<details class="details-left">
  <summary class="summary-left" style="text-align: left;"><strong>
Back up your data
</strong></summary>
<br>
Any data you care about should be backed up in at least two places. There are numerous options for this including cloud backups, external SSDs, flash drives, ... . There are options for creating incremental snapshots of your entire system, or you can manually copy files, or something in between. Let us know if you want advice for your individualized setup, and if desired we can handle the entire process for you. 
</details>
<hr>
<details class="details-left">
  <summary class="summary-left" style="text-align: left;"><strong>
Use a firewall
</strong></summary>
    <br>
A firewall acts as a barrier to prevent unauthorized access to your device while connected to the internet. If possible, we recommend this is the first thing you do (BEFORE connecting to the internet) when setting up a new computer or operating system. Many operating systems come with a firewall installed, but often do not have it enabled by default. Historically many applications (especially online games) would conflict with firewalls, however with modern technology this less common, and for most use-cases default firewall settings (deny incoming, accept outgoing) will work just fine. The methods for setting up a firewall vary by operating system, but we can always set one up for you, or walk you through the setup over a remote consultation (and in edge-cases ensure it doesn't conflict with software).
</details>
<hr>
<details class="details-left">
  <summary class="summary-left" style="text-align: left;"><strong>
Verify Programs
  </strong></summary>
  <br>
Don't run anything you don't trust, and always use official sources for your downloads. Be extremely cautious about running programs you download off the internet. Some vendors provide cryptographic verification (many package managers will perform verification automatically), and if they don't, you should be very cautious about running their software. Check URLs, make sure they start with https://, and NOT http:// (many browsers will indicate whether https is working by a locked padlock to the left of the addressbar, if the padlock is unlocked your connect is not secure): http connections are not secure (the s DOES stand for secure, as https traffic is encrypted). Cross reference the website, read reviews, download from multiple sources and compare cryptographic hashes of downloaded files if provided (sha256sum, for example), ... If you need help, don't hesitate to reach out to us.
</details>
<hr>
<details class="details-left">
  <summary class="summary-left" style="text-align: left;"><strong>
Updates: Keeping up with security updates is important
  </strong></summary>
  <br>
Ideally you should check for and install security updates every time you use your computer. Vulnerabilities are often discovered and patched on a daily basis.
</details>
<hr>
<details class="details-left">
  <summary class="summary-left" style="text-align: left;"><strong>
Power Off / Disconnect the Internet
  </strong></summary>
  <br>
Some malicious software can run in the background, and even wait until your computer is inactive to kick in. In mission-critical settings, disconnecting the internet every time you step away from your computer is a good idea, and will reduce the chance of being hacked, or data leakage. Powering off your computer can reset bugs, and will stop some malicious software in its tracks. If you believe your computer has been infected, your first step should be to disconnect the internet as soon as possible, then power down your computer. Next, we advise you contact Secure Computer Solutions us for a malware / virus removal service, as we cannot guarantee that any other service will be as committed to ensuring your data integrity, or as thorough at removing any traces of malicious software.
</details>
<hr>
<details class="details-left">
  <summary class="summary-left" style="text-align: left;"><strong>
Anti-Virus Software
  </strong></summary>
  <br>
It is a good idea to regularly scan your computer for viruses, and to use real-time detection services. If you use Windows, you can use Windows Defender for free, which isn't a bad choice. There are plenty of other paid options to consider, and we encourage you to research various options, and of course, you can always reach out to us for advice or installation. Avoid Over-Dependence on Antivirus. Even the best virus software is not a replacement for safe usage habits: avoiding viruses in the first place should be the goal, since no virus removal / protection program is perfect. Antivirus software can help, but it should be part of a broader security strategy.
</details>
<hr>
<details class="details-left">
  <summary class="summary-left" style="text-align: left;"><strong>
Avoid http: Use https
  </strong></summary>
  <br>
Using http (without the s) is especially risky when sensitive information is involved (such as passwords or your birth date), and can greatly increase the attack surface of your browser to things like script injection. Enable https only in your browser. If your browser does not have https only, use a different browser. If you must use http, doing so through a VPN can reduce the risk. Verify anything you download: downloading things through http is very dangerous as it is susceptible to "man in the middle" attacks, though if you can verify the download through cryptographic hashes, this mitigates the risk. Using a VPN can make it harder for a malicious agent to single you out. Even when using HTTPS, always verify URLs, as scammers can make URLs which look similar to popular websites (referred to as "typosquatting"). Note that sometimes legitimate websites can have issues with their https: if you get a browser security warning on a site which you are confident is a legitimate domain, try reseting your internet connection or opening it in a new private-browsing window.
</details>
<hr>
<details class="details-left">
  <summary class="summary-left" style="text-align: left;"><strong>
Run your Browser in Private / Incognito mode when possible
  </strong></summary>
  <br>
(note that private mode does NOT make your activity anonymous). If whatever you are doing does not require logging in or remembering your preferences, then there's no reason to drag cookies around. Typically in private / incognito mode, browsers will erase all cookies and cache when closed, which can even improve internet stability. Again, this NOT make you anonymous by itself, but it will reduce cookie tracking (but not other types of tracking such as IP address tracking or fingerprinting). You can have a private window open at the same time as a regular window, so keep your main logins in a regular window, and use a private window for things which don't require logging in, or even to separate different logins.
</details>
<hr>
<details class="details-left">
  <summary class="summary-left" style="text-align: left;"><strong>
Use a VPN (maybe)
  </strong></summary>
  <br>
Using a VPN is especially valuable when using a public network, as public networks can open you up to various attacks (such as DHCP spoofing) and surveillance. Using a VPN can make it harder for hackers to target you and steal your data. It can make it harder for companies to profile you. It can hide your activity from your Internet Service Provider (and from your local network). Many VPN providers even offer real-time malware protection and ad-blocking: ad-blocking carries several benefits, as it can improve performance, and even stop some malware and tracking. However, a bad VPN (or ad-blocker) can be worse than no VPN (or ad-blocker), and just because a VPN is popular does not mean it is good. For example, we do NOT recommend NordVPN as their client software (at least for Linux) makes alarmingly insecure modifications to your firewall (without your consent), and NordVPN support refuses to explain why this is necessary, citing it as a "commercial secret". Feel free to ask us for more details, evidence, and additonal reasons why we dislike NordVPN. Ad-blockers can also carry some risk, as they can potentially contain spyware. Installing additional software always carries some risk, as it requires trusting the developers, and can increase the attack surface of your machine. If you follow all of our other security guidelines, in some contexts, especially on a private network, using a VPN may not be necessary or even recommended. Let us know if you want advice on which VPN or ad-blocker to choose, or if you need help installing it. Be cautious, as many scammers will masquerade as VPN providers. Not all VPNs are created equal: if you're unsure about which VPN to choose or need help installing one, feel free to reach out to Secure Computer Solutions.
</details>
<hr>
</div>
