<script>
  import Sidebar from '/components/layout/Sidebar'
  const contents = [
    { id: 'what-we-collect', title: 'Which Information We Collect' },
    { id: 'how-we-collect', title: 'How We Collect Your Information' },
    { id: 'how-we-use', title: 'How We Use Your Information' },
    { id: 'how-we-share', title: 'How We Use Your Information' },
    { id: 'your-rights', title: 'Your Data Protection Rights' },
    { id: 'how-we-secure', title: 'How We Secure Your Data' },
    { id: 'international-data', title: 'International Transfers of Data' },
    { id: 'business-transfers', title: 'Business Transfers' },
    { id: 'other-websites', title: 'Other Websites' },
    { id: 'policy-changes', title: 'Changes to our Privacy Policy' },
    { id: 'contact', title: 'How You Can Contact Us' },
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

<Sidebar>
  <ol class="p-4">
    {#each contents as { id, title }}
      <li class="my-4">
        <a href="docs/privacy-policy#{id}">{title}</a>
      </li>
    {/each}
  </ol>
</Sidebar>
<h1 class="text-5xl font-black my-2">Privacy Policy</h1>
<span class="text-gray-500 mb-6">Last Updated: July 25th, 2019</span>
<section id="what-we-collect">
  <h2>Which Information We Collect</h2>
  <p>
    <em>Personal Identification Information.</em>
    When you register for a BadukClub account, we request your email address.
    You may also choose to fill out a profile with your name and phone number.
  </p>
  <p>
    <em>Cookies.</em>
    Cookies are text files placed on your computer to collect standard Internet
    log information and visitor behavior information. When you log into
    BadukClub, we use a cookie to store encrypted user information, which acts
    as your user session. This cookie is automatically deleted when you log out.
    For further information, visit
    <a href="https://allaboutcookies.org" target="_blank">
      allaboutcookies.org
    </a>
    .
  </p>
  <p>
    You can set your browser to not accept cookies, and the above website tells
    you how to remove cookies from your browser. However, your user session will
    be lost as a result.
  </p>
  <p>
    <em>Age Restriction.</em>
    If you're a child under the age of 13, you may not have an account on
    BadukClub. BadukClub does not knowingly collect information from or direct
    any of our content specifically to children under 13. If we learn or have
    reason to suspect that you are a user who is under the age of 13, we will
    unfortunately have to close your account.
  </p>
</section>
<section id="how-we-collect">
  <h2>How We Collect Your Information</h2>
  <p>
    You directly provide BadukClub with most of the data we collect. We collect
    data and process data when you:
  </p>
  <ul>
    <li>Register online</li>
    <li>Voluntarily provide feedback via email</li>
    <li>Fill out your profile information</li>
  </ul>
</section>
<section id="how-we-use">
  <h2>How We Use Your Information</h2>
  <p>
    In regards to our Legal Bases For Processing, we process information
    lawfully, fairly and transparently. We only collect and process information
    about you only where:
  </p>
  <ul>
    <li>
      We need your Personal Information to create your account, and to provide
      the services you request.
    </li>
    <li>
      We will use your email address to communicate with you, if you've said
      that's okay, and only for the reasons you’ve said that’s okay.
    </li>
  </ul>
</section>
<section id="how-we-share">
  <h2>How We Share Your Information</h2>
  <p>
    <em>Public information on BadukClub</em>
    . Much of BadukClub is public facing. Information you choose to make public
    such as your personal contact information and/or location can be seen and
    potentially aggregate by third parties.
  </p>
</section>
<section id="your-rights">
  <h2>Your Data Protection Rights</h2>
  <p>
    BadukClub would like to make sure you are fully aware of all of your data
    protection rights. Every user is entitled to the right to access,
    rectification, erasure, restrict processing, object to processing, data
    portability. If you make a request, we have one month to respond to you. If
    you would like to exercise any of these rights, please contact us at our
    email:
    <a href="mailto:privacy@baduk.club">privacy@baduk.club</a>
    .
  </p>
</section>
<section id="how-we-secure">
  <h2>How We Secure Your Data</h2>
  <p>
    BadukClub takes all reasonable steps to protect the data that we receive
    from loss, misuse, and unauthorized access, disclosure, alteration, or
    destruction. We utilize appropriate physical, digital, and administrative
    protocols to keep your information secure, including the use of encryption
    services. Notwithstanding, no Internet or email transmission is ever fully
    secure or error free. In particular, email sent to or from our website may
    not be secure. Therefore, take special care in deciding what information you
    send to us via email.
  </p>
</section>
<section id="international-data">
  <h2>International Transfers of Data</h2>
  <p>
    The data we retain is stored and processed in the USA and where our
    third-party providers maintain facilities. By providing us with your
    personal information, you consent to the disclosure to these overseas third
    parties.
  </p>
</section>
<section id="business-transfers">
  <h2>Business Transfers</h2>
  <p>
    If we or our assets are acquired, or in the unlikely event that we go out of
    business or enter bankruptcy, we would include data among the assets
    transferred to any parties who acquire us. You acknowledge that such
    transfers may occur, and that any parties who acquire us may continue to use
    your personal information according to this policy.
  </p>
</section>
<section id="other-websites">
  <h2>Other Websites</h2>
  <p>
    The BadukClub website contains links to other websites. Our privacy policy
    applies only to our website, so if you click on a link to another website,
    you should read their privacy policy.
  </p>
</section>
<section id="policy-changes">
  <h2>Changes to our Privacy Policy</h2>
  <p>
    At our discretion, we may update this policy to reflect current acceptable
    practices. We will take reasonable steps to let users know about significant
    changes via our website. Your continued use of this site after any changes
    to this policy will be regarded as acceptance of our practices around data
    and personal information.
  </p>
</section>
<section id="contact-us">
  <h2>How You Can Contact Us</h2>
  <p>
    If you have any questions about BadukClub’s privacy policy, the data we hold
    on you, or you would like to exercise one of your data protection rights,
    please do not hesitate to contact us at
    <a href="mailto:privacy@baduk.club">privacy@baduk.club</a>
    .
  </p>
</section>
