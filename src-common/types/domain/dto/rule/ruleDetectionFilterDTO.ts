import { Expose } from 'class-transformer';

export interface IRuleDetectionFilterDTO {
    id?: number;
    rule_id?: number;
    track: string;
    count: number;
    seconds: number;
}

@Expose()
export class RuleDetectionFilterDTO {
    @Expose()
    id?: number;
    @Expose()
    track: string;
    @Expose()
    count: number;
    @Expose()
    seconds: number;

    constructor(track: string, count: number, seconds: number, id?: number) {
        this.id = id;
        this.track = track;
        this.count = count;
        this.seconds = seconds;
    }
}

@Expose()
export class CreateRuleDetectionFilterDTO {
    @Expose()
    track: string;
    @Expose()
    count: number;
    @Expose()
    seconds: number;

    constructor(track: string, count: number, seconds: number) {
        this.track = track;
        this.count = count;
        this.seconds = seconds;
    }
}
@Expose()
export class UpdateRuleDetectionFilterDTO {
    @Expose()
    id?: number;
    @Expose()
    track?: string;
    @Expose()
    count?: number;
    @Expose()
    seconds?: number;

    constructor(id?: number, track?: string, count?: number, seconds?: number) {
        this.id = id;
        this.track = track;
        this.count = count;
        this.seconds = seconds;
    }
}
