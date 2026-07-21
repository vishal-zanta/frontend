import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Key, Mail, MapPin, Phone, Shield } from 'lucide-react'
import { apiPermissionOptions } from "@/utils/constants"
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
                    <Calendar className="w-3.5 h-3.5 text-blue-500" /> Last Login
                  </span>
                  <span className="font-medium text-foreground block">{viewUser?.lastLogin || "N/A"}</span>
                </div>

                <div className="md:col-span-2 space-y-1.5 p-3 rounded-lg border border-border/60 bg-muted/20">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-emerald-500" /> Permissions ({viewUser?.permissions?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                    {viewUser?.permissions && viewUser.permissions.length > 0 ? (
                      viewUser.permissions.map((p) => {
                        const label = apiPermissionOptions.find((a) => a.value === p)?.label || p;
                        return (
                          <Badge
                            key={p}
                            variant="outline"
                            className="text-[10px] bg-primary/10 text-primary"
                          >
                            {label}
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="text-xs text-muted-foreground">No Permissions Assigned</span>
                    )}
                  </div>
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