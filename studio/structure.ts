// Define singleton document IDs here

import type {StructureResolver} from 'sanity/structure'
import {MasterDetailIcon} from '@sanity/icons'
import {DashboardIcon} from '@sanity/icons'

const singletons = ['site', 'landingPage']

const hiddenTypes = [...singletons]

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      // Top-level singleton
      S.listItem()
        .title('Site')
        .icon(DashboardIcon)
        .child(S.document().schemaType('site').documentId('site')),

      // Pages folder
      S.listItem()
        .title('Pages')
        .icon(MasterDetailIcon)
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Landing Page')
                .child(S.document().schemaType('landingPage').documentId('landingPage')),
            ]),
        ),

      // Everything else (exclude hidden types and the ones we added above)
      ...S.documentTypeListItems().filter((listItem) => !hiddenTypes.includes(listItem.getId()!)),
    ])
