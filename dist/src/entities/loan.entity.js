"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanEntity = void 0;
const typeorm_1 = require("typeorm");
const room_entity_1 = require("./room.entity");
const user_entity_1 = require("./user.entity");
let LoanEntity = class LoanEntity {
    id;
    room;
    instructor;
    guarda;
    numeroPc;
    estado;
    createdAt;
    acceptedAt;
};
exports.LoanEntity = LoanEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', name: 'id' }),
    __metadata("design:type", Number)
], LoanEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.RoomEntity, { nullable: false, onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'room_id', referencedColumnName: 'id' }),
    __metadata("design:type", room_entity_1.RoomEntity)
], LoanEntity.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { nullable: false, onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'instructor_id', referencedColumnName: 'id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], LoanEntity.prototype, "instructor", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, { nullable: false, onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'guarda_id', referencedColumnName: 'id' }),
    __metadata("design:type", user_entity_1.UserEntity)
], LoanEntity.prototype, "guarda", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'numero_pc' }),
    __metadata("design:type", Number)
], LoanEntity.prototype, "numeroPc", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 24, name: 'estado' }),
    __metadata("design:type", String)
], LoanEntity.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], LoanEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', name: 'accepted_at', nullable: true }),
    __metadata("design:type", Object)
], LoanEntity.prototype, "acceptedAt", void 0);
exports.LoanEntity = LoanEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'loans' })
], LoanEntity);
