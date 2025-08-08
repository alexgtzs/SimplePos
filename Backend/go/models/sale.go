package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Sale struct {
    ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
    Product   string             `json:"product" bson:"product"`
    Quantity  int                `json:"quantity" bson:"quantity"`
    Amount    float64            `json:"amount" bson:"amount"`
    Seller    string             `json:"seller" bson:"seller"`
    Timestamp int64              `json:"timestamp" bson:"timestamp"`
}