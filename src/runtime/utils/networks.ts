import { v4 as uuidv4 } from 'uuid'
import { useAuthLazyFetch, useHandlebars } from '#imports'

// Get facebook account information with access_token
const getFacebookAccount = async (pluginResponse: any) => {
    const response = await useAuthLazyFetch(useHandlebars(`{{ api.facebook.accounts }}`), {
        params: {
            access_token: pluginResponse.user_data.token.access_token,
            fields: 'name,access_token,picture',
        },
    })
    if (!response.data.value) {
        return []
    }
    let accounts = response.data.value.data
    accounts = accounts.map((account) => {
        // Save account with domain and uid information
        account.domain = pluginResponse.plugin_name
        account.id = pluginResponse.uid
        return account
    })
    return accounts
}
// Get instagram account information with id and access_token
const getInstagramAccount = async (pluginResponse: any) => {
    const response = await useAuthLazyFetch(useHandlebars(`{{ api.instagram.accounts }}/`), {
        params: {
            plugin_id: pluginResponse.uid,
        },
    })
    if (!response.data.value) {
        return []
    }
    let accounts = response.data.value

    accounts = accounts.map((account) => {
        // Save account with domain and uid information
        account.domain = pluginResponse.plugin_name
        account.id = pluginResponse.uid
        return account
    })
    return accounts
}

// Get every page in added linkedin account
const getLinkedInAccount = async (pluginResponse: any) => {
    const response = await useAuthLazyFetch(useHandlebars(`{{ api.linkedin.pages }}/${pluginResponse.uid}/organizations`), {
        params: { access_token: pluginResponse.user_data.token.access_token },
    })
    const accounts: object[] = []
    if (response.data.value) {
        response.data.value.forEach((page: object) => {
            accounts.push({
                name: page['organizationalTarget~'].localizedName,
                access_token: pluginResponse.user_data.token.access_token,
                id: pluginResponse.uid,
                domain: pluginResponse.plugin_name,
                organization_id: page.organizationalTarget,
            })
        })
    }
    return accounts
}

// Get profile information and access tokens from authenticated networks
export const getAllNetworks = async () => {
    // Get authenticated plugins from ORM
    const userPluginsURL = useHandlebars(`{{ api.userPluginsURL}}`)
    const response = await useAuthLazyFetch(`${userPluginsURL}/qsearch?offset=0&limit=100&sort_column=id&sort_direction=desc`, {})

    let networks: object[] = []

    if (response?.data?.value) {
        // Parallelly make calls to respective social networks for faster fetching account information
        networks = await Promise.all(
            response.data.value.map(async (plugin: object) => {
                if (['LinkedIn', 'Facebook', 'Instagram', 'Twitter'].includes(plugin.plugin_name)) {
                    // Plugin response contains string values with single quotes(') and 'None' objects
                    // Which needs to be replaced by double quotes(") and 'null' objects respectievely for parsing into JSON format.
                    plugin.user_data.token = JSON.parse(plugin.user_data.token.replace(/'/gim, '"').replace(/(None)/gim, 'null'))
                    plugin.user_data.profile = JSON.parse(
                        decodeURI(plugin.user_data.profile)
                            .replace(/'/gim, '"')
                            .replace(/(None)/gim, 'null'),
                    )

                    switch (plugin.plugin_name) {
                        case 'Facebook': // Get facebook account details
                            return await getFacebookAccount(plugin)
                            break
                        case 'Instagram': // Get instagram account details
                            return await getInstagramAccount(plugin)
                            break
                        case 'LinkedIn': // Get linkedin account details
                            return await getLinkedInAccount(plugin)
                            break
                    }
                }
            }),
        )
        // Response collected in networks variable is list of lists
        // Hence we are flattening array for complete list of accessible networks
        // Also we remove false resulting values from the networks list and add unique ID for each network
        return networks
            .flat(10)
            .filter(Boolean)
            .map((network: object) => {
                network.uid = uuidv4()
                return network
            })
    }
    return networks
}

export default {
    getAllNetworks,
}
