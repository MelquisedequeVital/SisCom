import { Routes } from "@angular/router";
import { MeetingManagement } from "./meeting-management";
import { MeetingSelection } from "./meeting-selection/meeting-selection";

export const MANAGEMENT_ROUTES: Routes = [
    {
        path: '',
        component: MeetingManagement,
        children: [
            {
                path: '',
                component: MeetingSelection
            }
        ]
    }
]