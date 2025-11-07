'use client'

import { ApartmentForm } from '../components/ApartmentForm'
import {Card} from "@/components/ui/card";
import React from "react";

export default function CreateApartmentPage() {
  return (
      <div className="min-h-full">
          <Card className="w-full">
              <div className="px-6">
                  <ApartmentForm />
              </div>
          </Card>
      </div>
  )
}
