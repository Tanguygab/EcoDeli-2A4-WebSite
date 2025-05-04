import router from "@/router"

function def(key: any, defv: any) {
    const query = router.currentRoute.value.query
    return query[key] === undefined ? defv : query[key]
}

function newPagination(): Pagination {
    return {
        filter: def("filter", ""),
        page: parseInt(def("page", 0)),
        max_entries: parseInt(def("max_entries", 20)),
        ascending: def("ascending", true) === "true"
    }
}

function paginate(url: string, pagination: Pagination): string {
    return `${url}?filter=${pagination.filter}&page=${pagination.page}&max_entries=${pagination.max_entries}&ascending=${pagination.ascending}`
}

export type Pagination = {
    filter: string,
    page: number,
    max_entries: number,
    ascending: boolean
}

export { newPagination, paginate }