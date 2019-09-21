<script>
  import Sidebar from '/components/layout/Sidebar'
  const contents = [
    { id: 'use', title: 'Use of this Website' },
    { id: 'your-account', title: 'Your Account' },
    {
      id: 'personal-information',
      title: 'Privacy and Protection of Personal Information',
    },
    { id: 'club-information', title: 'Club Information posted on the Website' },
    {
      id: 'restrictions-and-use',
      title: 'Copyright Restrictions & Use of Content',
    },
    { id: 'trademarks', title: 'Trademarks' },
    {
      id: 'disclaimer',
      title: 'Disclaimer of Warranties and Limitation of Liability',
    },
    { id: 'disputes', title: 'Disputes' },
    { id: 'indemnification', title: 'Indemnification' },
    { id: 'comments-and-submissions', title: 'Comments and Submissions' },
    { id: 'third-party-links', title: 'Third Party Links' },
    { id: 'termination', title: 'Termination' },
    { id: 'provisions', title: 'Miscellaneous Provisions' },
  ]
</script>

<style>
  section {
    @apply pt-16 -mt-16;
  }

  p {
    @apply my-6 text-lg;
  }

  h2 {
    @apply font-semibold text-3xl;
  }

  a {
    @apply text-blue-500;
  }

  a:hover {
    @apply underline;
  }

  ul {
    @apply pl-2;
    list-style: '-';
  }

  ul > li {
    @apply pl-4 pb-4 text-lg;
  }
</style>

<svelte:head>
  <title>Terms of Service | BadukClub</title>
  <meta property="og:title" content="Terms of Service | BadukClub" />
</svelte:head>

<Sidebar>
  <ol class="p-4">
    {#each contents as { id, title }}
      <li class="my-4">
        <a href="docs/terms-of-service#{id}">{title}</a>
      </li>
    {/each}
  </ol>
</Sidebar>

<h1 class="text-5xl font-black my-2">Terms of Service</h1>
<span class="text-gray-500 mb-6">Effective Starting: July 25th, 2019</span>
<p>
  All users are subject to the following terms and conditions of use. By
  accessing or using this website, you agree that you have read, understood, and
  agree to be bound by these Terms of Use. We’ve tried to write this document as
  plainly as possible but some legalese is unfortunately necessary.
</p>
<section id="use">
  <h2>Use of this Website</h2>
  <p>
    You agree to use this website only for lawful purposes related to your
    pursuit of the activities and programming supported by your club. You agree
    that you will NOT use it to:
  </p>
  <ul>
    <li>
      Upload or transmit any content that is unlawful, harmful, threatening,
      abusive, harassing, defamatory, obscene, libelous, hateful, or racially,
      ethnically or otherwise objectionable according to the community standards
      of your club.
    </li>
    <li>
      Violate the legal rights of others (including their right to privacy), or
      violate the laws of any jurisdiction.
    </li>
    <li>
      Impersonate any person or entity, including, but not limited to, a
      BadukClub administrator, or misrepresent your affiliation with a person or
      entity.
    </li>
    <li>
      Upload or otherwise transmit data that you do not have the legal right to
      upload or transmit, that violates any patent, trademark, trade secret, or
      copyright, or that contains a virus or deliberately corrupted data. You
      acknowledge that you have full rights to transmit the data that you upload
      or post, and you accept full responsibility for its legality, reliability
      and appropriateness.
    </li>
    <li>
      Collect information about others (including contact information and email
      addresses) without their consent.
    </li>
    <li>
      Upload, store, maintain, forward or display adult content, including
      documents and images of a lewd or lascivious nature. This website and the
      messages, documents, and images it contains may be viewed by children, so
      all users share responsibility for ensuring that content is appropriate.
    </li>
    <li>
      Engage in any other conduct that restricts or inhibits anyone’s use or
      enjoyment of the website or the BadukClub platform, or which, as
      determined by BadukClub, may harm BadukClub or users of the website, or
      expose them to liability.
    </li>
  </ul>
  <p>
    The administrators of BadukClub reserve the right to remove any information
    or material from the website, without explanation, which we determine at our
    sole discretion, to be incompatible with the above restrictions, including
    anything that we believe, through our own research or notification by
    others, may constitute a copyright infringement.
  </p>
  <p>
    However, these actions will be performed on a best-effort basis. The
    administrators of BadukClub cannot review all material that is posted to the
    website, nor guarantee that objectionable material is immediately removed.
    Therefore, BadukClub does not assume liability for any action or inaction
    regarding such material uploaded to the website, or indeed, for the content
    itself.
  </p>
  <p>
    If you believe that your intellectual property is being violated by
    something on this website, please notify BadukClub immediately with
    sufficient documentation to allow us to identify the infringing material and
    its location, as well as your claim and authority to file this notification,
    and your contact information.
  </p>
</section>
<section id="your-account">
  <h2>Your Account</h2>
  <p>
    If you are a registered user of this website, you will create a username and
    password which are used to log into your account. You are responsible for
    maintaining the confidentiality of your username and password, and are fully
    responsible for all activities that occur under your account. If you are
    accessing this website from a shared computer (such as in a public library),
    you must be careful to log out of the account and close the browser before
    leaving the workstation. If you suspect that your account has been
    compromised in any way, you must notify BadukClub immediately. BadukClub
    will not be liable for any loss or damage arising from your failure to
    comply with the provisions in this section.
  </p>
</section>
<section id="personal-information">
  <h2>Privacy and Protection of Personal Information</h2>
  <p>
    BadukClub's collection, storage and use of your personal information is
    described in the
    <a href="/docs/privacy-policy" target="_blank">Privacy Policy</a>
    , which is incorporated by reference into this document.
  </p>
</section>
<section id="club-information">
  <h2>Club Information posted on the Website</h2>
  <p>
    Meetups and events are organized and sponsored by your club and/or a parent
    club or other chapter of the parent club. Some information on this website
    regarding events may be provided by the event sponsor or organizer.
    BadukClub has not verified or certified the accuracy or completeness of this
    information, and will not be liable for any errors or omissions. You also
    agree to hold BadukClub and its agents harmless from any liability or injury
    arising from or related to your participation in such events.
  </p>
  <p>
    In using the website, you may elect to display personal information to other
    members or to see personal information provided by other members. You agree
    that your use of this information will be governed by the
    <a href="/docs/privacy-policy" target="_blank">Privacy Policy</a>
    referenced above.
  </p>
</section>
<section id="restrictions-and-use">
  <h2>Copyright restrictions &amp; Use of Content</h2>
  <p>
    You are authorized to use this information as a user of the website. You may
    not use this information to create competing or derivative works, nor may
    you distribute it to others as if it were your own. You are not permitted to
    reproduce, sell or use this information for any commercial purposes without
    BadukClub's written permission. You are also not permitted to resell or
    otherwise distribute the products and services provided by BadukClub without
    BadukClub's written permission.
  </p>
</section>
<section id="trademarks">
  <h2>Trademarks</h2>
  <p>
    Other product or service marks contained herein are used for identification
    purposes only and may be registered trademarks or trademarks of their
    respective owners.
  </p>
</section>
<section id="disclaimer">
  <h2>Disclaimer of Warranties and Limitation of Liability</h2>
  <p>
    THIS WEBSITE IS PROVIDED BY BADUKCLUB ON AN "AS IS" AND "AS AVAILABLE"
    BASIS. BADUKCLUB MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS
    OR IMPLIED, AS TO THE OPERATION OF THIS WEBSITE OR THE INFORMATION, CONTENT,
    MATERIALS, OR PRODUCTS INCLUDED ON THIS WEBSITE, WHICH HAVE NOT BEEN
    INDEPENDENTLY REVIEWED FOR ACCURACY, COMPLETENESS OR SAFETY.
  </p>
  <p>
    IF YOU RELY ON ADVICE OR INFORMATION PROVIDED ON THIS WEBSITE, YOU EXPRESSLY
    AGREE THAT YOU ARE DOING SO ENTIRELY AT YOUR OWN RISK. BADUKCLUB EXPLICITLY
    DISCLAIM ANY LIABILITY FOR INJURY OR DAMAGES RESULTING FROM THE USE THEREOF.
  </p>
  <p>
    TO THE FULL EXTENT PERMISSIBLE BY APPLICABLE LAW, BADUKCLUB DISCLAIMS ALL
    WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED
    WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
  </p>
  <p>
    BADUKCLUB DOES NOT WARRANT THAT THIS WEBSITE, ITS SERVERS, OR E-MAIL OR
    MESSAGES SENT FROM THIS WEBSITE ARE FREE OF VIRUSES OR OTHER HARMFUL
    COMPONENTS, NOR THAT YOUR ACCESS TO THIS WEBSITE AND ITS SERVERS WILL BE
    RELIABLE, ERROR-FREE, OR UNINTERRUPTED.
  </p>
  <p>
    BADUKCLUB WILL NOT BE LIABLE FOR DAMAGES OF ANY KIND ARISING FROM THE USE OF
    THIS WEBSITE, INCLUDING, BUT NOT LIMITED TO DIRECT, INDIRECT, INCIDENTAL,
    PUNITIVE, AND CONSEQUENTIAL DAMAGES, ARISING OUT OF PERSONAL INJURY, LOST
    PROFITS OR DAMAGES RESULTING FROM DELAY, INTERRUPTION IN SERVICE, LOST DATA,
    OR OTHER ERRORS OR OMISSIONS.
  </p>
  <p>
    CERTAIN STATE LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE
    EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME
    OR ALL OF THE ABOVE DISCLAIMERS, EXCLUSIONS, OR LIMITATIONS MAY NOT APPLY TO
    YOU, AND YOU MIGHT HAVE ADDITIONAL RIGHTS.
  </p>
</section>
<section id="disputes">
  <h2>Disputes</h2>
  <p>
    With the possible exception of a violation or threatened violation of
    BadukClub's intellectual property rights, any dispute related to your use of
    this website shall be submitted to binding arbitration in Ohio in accordance
    with the prevailing rules of the American Arbitration Association. The
    arbitrator's award shall be binding and may be entered as a judgment in any
    court of competent jurisdiction. At BadukClub’s sole discretion,
    intellectual property disputes may be handled through the appropriate state
    or federal court in the state of Ohio, and you consent to the exclusive
    jurisdiction and venue in such courts.
  </p>
  <p>
    As outlined in the
    <a href="/docs/privacy-policy" target="_blank">Privacy Policy</a>
    referenced above, you also have rights under international data protection
    regulations, including the right to be deleted from our database, the right
    to object to processing, and the right to complain to a local Data
    Processing Authority.
  </p>
</section>
<section id="indemnification">
  <h2>Indemnification</h2>
  <p>
    You agree to indemnify and hold harmless BadukClub and our respective
    officers, directors, shareholders, employees, agents, affiliates, third
    party information providers, licensors and others involved in the
    development or maintenance of this website, or the delivery of products or
    services through the website, from and against any and all liabilities,
    expenses, damages and costs, including reasonable attorney’s fees, arising
    from any violation by you of these Terms of Use or your use of this website,
    or of any products, services or information obtained from this website.
  </p>
</section>
<section id="comments-and-submissions">
  <h2>Comments and Subbmissions</h2>
  <p>
    BadukClub welcomes your ideas for improving this website or for adding new
    features that would benefit club members and visitors. However, please
    understand that we may already be working on similar features or talking to
    other vendors who offer this capability.
  </p>
  <p>
    If you have a business proposition for us, please contact us directly rather
    than submitting it through this website. Any comments, ideas, suggestions,
    or feedback that you submit to BadukClub cannot be treated as confidential
    or proprietary and can be used or disclosed by either organization as it
    sees fit. The submission of such information does not limit or prevent the
    purchase or use of similar products, services or ideas from any other party
    or vendor.
  </p>
</section>
<section id="third-party-links">
  <h2>Third Party Links</h2>
  <p>
    This website may contain links to other locations on the Internet not
    controlled or managed by BadukClub. BadukClub is not responsible for the
    quality, accuracy or content of information, products, services or policies
    on these websites. Your use of such websites is at your own risk and subject
    to the terms and conditions of use for such websites. A reference or link
    from this website to any products, services, events or information by
    trademark, trade name or manufacturer does not constitute or imply an
    endorsement, sponsorship or recommendation and cannot be referenced as such
    without the written permission of BadukClub.
  </p>
</section>
<section id="termination">
  <h2>Termination</h2>
  <p>
    The administrators of BadukClub also reserve the right to terminate access
    to this website and refuse service to users who violate these Terms of Use
    or who we reasonably believe are not intending to use the platform for its
    intended purpose, and to pursue legal remedies against persistent or serious
    offenders.
  </p>
</section>
<section id="provisions">
  <h2>Miscellaneous Provisions</h2>
  <p>
    The use and operation of this website shall be governed by the laws of the
    State of Ohio without regard to conflict of law provisions. If you sign up
    for membership, register for an event, make a donation, or purchase products
    and services through this website from another country, you do so in
    accordance with US law.
  </p>
  <p>
    If a court should hold any provision of this Agreement invalid or
    unenforceable, such provision shall be modified to the minimum extent
    necessary to render it enforceable without losing its intent, or severed
    from this Agreement if no such modification is possible, and other
    provisions shall remain in full force and effect.
  </p>
  <p>
    BadukClub may modify these Terms of Use at any time without notice by
    posting this amended and dated document to the website. You should check
    back periodically to see if anything has changed. Your continued use of the
    website indicates your acceptance of the revised Terms of Use.
  </p>
  <p>
    If you have any questions, comments, or concerns about this Terms Of Use,
    please contact us at:
    <a href="mailto:terms@baduk.club" target="_blank">terms@baduk.club</a>
  </p>
</section>
