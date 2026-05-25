import { Routes } from "@angular/router";
import { ChatManagement } from "./chat-management";
import { Component } from '@angular/core';
import { ChatManagementSelection } from "./chat-management-selection/chat-management-selection";

export const CHAT_ROUTES: Routes = [
    {
        path: '',
        component: ChatManagement,
        children: [
            {
                path: '',
                component: ChatManagementSelection
            }
        ]
    }
]