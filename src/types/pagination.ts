import router from "@/router"

function def(key: any, defV: any) {
    const query = router.currentRoute.value.query
    return query[key] === undefined ? defV : query[key]
}

export type Pagination = {
    filter: string
    page: number
    limit: number
    ascending: boolean
}

function newPagination(): Pagination {
    return {
        filter: def("filter", ""),
        page: parseInt(def("page", 0)),
        limit: parseInt(def("limit", 10)), 
        ascending: def("ascending", "true") === "true"
    }
}

function paginate(url: string, pagination: Pagination): string {
    const params = new URLSearchParams()
    if (pagination.filter) params.append("filter", pagination.filter)
    params.append("page", pagination.page.toString())
    params.append("limit", pagination.limit.toString()) 
    params.append("ascending", pagination.ascending.toString())

    return `${url}?${params.toString()}`
}

export { newPagination, paginate }
