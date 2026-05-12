import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

import {structure} from './structure'
import {schema} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'sauna-studio',

  projectId: 'svms3v9p',
  dataset: 'production',

  schema,

  plugins: [structureTool({structure}), visionTool()],
})
