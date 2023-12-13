import { Asset, EntryFieldTypes, EntrySkeletonType } from 'contentful'

export type BlogPostFields = {
    title: EntryFieldTypes.Text
    description?: EntryFieldTypes.Text
    date: EntryFieldTypes.Date
    body: EntryFieldTypes.RichText
    slug: EntryFieldTypes.Text
    image?: Asset
    recommendedPosts?: EntrySkeletonType<BlogPostFields>[]
}

export interface BlogPostEntry extends EntrySkeletonType<BlogPostFields> {
}