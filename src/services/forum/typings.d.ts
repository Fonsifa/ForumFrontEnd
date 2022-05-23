declare namespace API {
    type Response<T> = {
        errCode: number,
        errMsg: string,
        data: T,
    };

    type User = {
        id: number,
        nickName: string,
        userName: string,
        password: string,
    };
    type Post = {
        id: number,
        content: string,
        title: string,
        uid: number,
        user?: User,
        time: string,
        tags: Array<API.Tag>,
    };
    type Comment = {
        id: number,
        content: string,
        uid: number,
        user: User,
        time: string,
        pid: number,
    };
    type Tag = {
        id: number,
        theme: string,
        posts?: Array<API.Post>,
    };

    type addCommentParams = {
        content?: string,
        uid?: number,
        pid?: number,
    };

    type addPostParams = {
        title: string,
        content: string,
        uid: number,
        tags: Array<number>
    };
    
    type updatePostParams = {
        id: number,
        title: string,
        content: string,
        uid: number,
        tags: Array<number>
    }
}