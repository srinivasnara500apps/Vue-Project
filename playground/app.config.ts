interface AppConfigInput {
    assetsURL: string
    appName: string
    api: {
        userPluginsURL: string
        facebook: {
            like: string
            posts: string
            accounts: string
            comment: string
        }
        instagram: {
            accounts: string
            posts: string
            comments: {
                get: string
            }
        }
        linkedin: {
            like: string
            pages: string
            posts: string
            comments: {
                get: string
                add: string
            }
        }
    }
}
const defineAppConfig: AppConfigInput = {
    assetsURL: 'https://assets.infinity-api.net/',
    appName: 'builderpe',
    api: {
        facebook: {
            like: 'https://api.builderpe.com/prod/bsfb/social/fb/like',
            posts: 'https://api.builderpe.com/prod/bsfb/social/fb/connections/me',
            accounts: 'https://api.builderpe.com/prod/bsfb/social/fb/connections/me/accounts',
            comment: 'https://api.builderpe.com/prod/bsfb/social/fb/comment',
        },
        instagram: {
            accounts: 'https://apiv2.gharpe.com/prod/si/social/instagram/connections',
            posts: 'https://apiv2.gharpe.com/prod/si/social/instagram',
            comments: {
                get: 'https://apiv2.gharpe.com/prod/si/social/instagram',
            },
        },
        linkedin: {
            like: 'https://apiv2.gharpe.com/prod/sl/social/linkedin',
            pages: 'https://apiv2.gharpe.com/prod/sl/social/linkedin',
            posts: 'https://apiv2.gharpe.com/prod/sl/social/linkedin',
            comments: {
                get: 'https://apiv2.gharpe.com/prod/sl/social/linkedin',
                add: 'https://apiv2.gharpe.com/prod/sl/social/linkedin',
            },
        },
        userPluginsURL: 'https://apiv2.builderpe.com/prod/ob/user-plugins/user_plugins',
    },
}

export default defineAppConfig
