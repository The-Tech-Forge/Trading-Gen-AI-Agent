import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AIModel } from "./ai-model.entity.js";

@Entity()
export class AIProvider {
    @PrimaryGeneratedColumn('uuid')
    ai_provider_id: string

    @Column()
    provider: string

    @Column({ type: 'text' })
    description: string

    @Column()
    website: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @Column()
    is_active: boolean

    @OneToMany(() => AIModel, (model) => model.provider)
    ai_models: AIModel[];
}