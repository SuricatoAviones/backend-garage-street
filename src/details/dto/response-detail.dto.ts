export class ResponseDetailDto {
    detail_id: number;
    text: string;
    img: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(detail) {
        this.detail_id = detail.detail_id;
        this.text = detail.text;
        this.img = detail.img;
        this.createdAt = detail.created_at;
        this.updatedAt = detail.updated_at;
    }
}