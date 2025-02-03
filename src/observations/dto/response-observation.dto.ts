export class  ResponseObservationDto {
    observation_id: number;
    text: string;
    img: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(observation) {
        this.observation_id = observation.observation_id;
        this.text = observation.text;
        this.img = observation.img;
        this.createdAt = observation.created_at;
        this.updatedAt = observation.updated_at;
    }
}