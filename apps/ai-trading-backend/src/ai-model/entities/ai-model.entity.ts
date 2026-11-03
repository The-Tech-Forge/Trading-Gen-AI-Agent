import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import type { Relation } from "typeorm";
import { AIProvider } from "./ai-provider.entity.js";

@Entity()
export class AIModel {
    @PrimaryGeneratedColumn('uuid')
    ai_model_id: string

    @Column()
    model: string

    @Column()
    description: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @Column()
    is_active: boolean

    @ManyToOne(() => AIProvider, (provider) => provider.ai_models)
    @JoinColumn({
        name: "ai_provider_id"
    })
    provider: Relation<AIProvider>;

}
