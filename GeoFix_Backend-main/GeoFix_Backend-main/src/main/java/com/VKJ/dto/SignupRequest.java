package com.VKJ.dto;

import com.VKJ.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    private String name;
    private String email;
    private String mobile;
    private String password;
    private String address;
    private Role role;
    private Boolean isAdmin;
    private String referralCode;
    private Long storeId;
    private Long referredByDeliveryBoyId;
    private long storeid;

    public Boolean getAdmin() {
        return isAdmin;
    }

    public void setAdmin(Boolean admin) {
        isAdmin = admin;
    }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}