import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import type { Relation } from "typeorm";
import { AIModel } from "./ai-model.entity.js";

@Entity("ai_model_pricing")
export class AIModelPricing {

    @PrimaryGeneratedColumn()
    ai_model_pricing_id: number;

    @Column({
        type: "decimal",
        precision: 20,
        scale: 10,
    })
    input_price: string;

    @Column({
        type: "decimal",
        precision: 20,
        scale: 10,
    })
    output_price: string;

    @Column({
        type: "varchar",
        length: 3,
    })
    currency: string;

    @Column({ type: "timestamptz" })
    effective_from: Date;

    @Column({
        type: "timestamptz",
        nullable: true,
    })
    effective_to: Date | null;

    @ManyToOne(
        () => AIModel,
        (model) => model.ai_model_pricings,
        { onDelete: "RESTRICT" },
    )
    @JoinColumn({ name: "ai_model_id" })
    model: Relation<AIModel>;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;
}