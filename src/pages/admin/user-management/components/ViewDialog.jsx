import { Button } from '@/components/ui/button'
import { Flame, Mail, MapPin, Phone, Shield } from 'lucide-react'
import React from 'react'

const ViewDialog = ({viewUser, setViewUser}) => {
  return (
       <div className="space-y-6 pb-4 text-sm">
              {/* Header profile section */}
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold shadow-md">
                  {viewUser?.name
                    ? viewUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "U"}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-foreground leading-none">{viewUser?.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground/75" />
                    <span>{viewUser?.email}</span>
                  </p>
                  
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 p-3 rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-primary" /> Designation / Role
                  </span>
                  <span className="font-medium text-foreground block">{viewUser?.role || "N/A"}</span>
                </div>

                <div className="space-y-1.5 p-3 rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Phone Number
                  </span>
                  <span className="font-medium text-foreground block">{viewUser?.apiData?.phone || "N/A"}</span>
                </div>

                <div className="space-y-1.5 p-3 rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Assigned District
                  </span>
                  <span className="font-medium text-foreground block">{viewUser?.district || "N/A"}</span>
                </div>

                <div className="space-y-1.5 p-3 rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" /> Escalated Cases
                  </span>
                  <span className="font-medium text-foreground block">
                    {viewUser?.apiData?.escalatedCount ?? 0}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end pt-2 border-t border-border/60">
                <Button
                  onClick={() => setViewUser(null)}
                  className="bg-primary hover:bg-primary/90 text-white font-medium px-6"
                >
                  Close
                </Button>
              </div>
            </div>
  )
}

export default ViewDialog