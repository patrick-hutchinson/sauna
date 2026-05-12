export const siteQuery = `*[_type=="site"][0]{
  title,
  owner,
  favicon{
    asset->{
      url
    }
  },
  description,
  address,
  email,
  phone,
  socials[]{
    platform,
    link
  },
}`;

export const landingPageQuery = `*[_type=="landingPage"][0]{
  sections[]{
    sectionTitle,
    sectionText,
    sectionKey
  },
}`;
