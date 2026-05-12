import {defineField, defineType} from 'sanity'

export const landingPage = defineType({
  name: 'landingPage',
  title: 'Landing Page',

  type: 'document',
  fields: [
    defineField({
      name: 'sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'section',
          fields: [
            {
              name: 'sectionTitle',
              type: 'string',
            },
            {
              name: 'sectionText',
              type: 'portableText',
            },
            {
              name: 'sectionKey',
              type: 'string',
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title,
      }
    },
  },
})
