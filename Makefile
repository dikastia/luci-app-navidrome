# See /LICENSE for more information.
# This is free software, licensed under the GNU General Public License v2.

include $(TOPDIR)/rules.mk

LUCI_TITLE:=LuCI Spp for Navidrome
LUCI_DEPENDS:=

PKG_NAME:=luci-app-navidrome
PKG_VERSION:=1.1
PKG_RELEASE:=1

define Package/luci-app-navidrome/conffiles
/etc/config/navidrome
/etc/navidrome
endef

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
