import {type SchemaTypeDefinition} from 'sanity'

import {landingPage} from './landingPage'
import {link} from './link'
import {site} from './site'
import {portableText} from './portableText'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [portableText, landingPage, site, link],
}
