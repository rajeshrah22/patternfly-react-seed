interface NmstateReviewData {
  /**
  * nmstate YAML schema.
  * If the user edited the YAML, this will be the new, edited version.
  */
  nmstateYaml: string;
  /**
  * Natural language description of the schema.
  */
  description: string;
  /**
  * Vote 'yes' for good match between description and schema.
  * Vote 'no' for requiring further review.
  */
  vote: 'yes' | 'no';
  /**
  * optional: Original description before any edits were made.
  * provide this if description is an edited version of the original.
  */
  originalDescirption?: string;
  /**
  * optional: user ID.
  * provide this if description is an edited version of the original.
  */
  userId?: string;
  reviewNotes?: string;
}

const descriptionList = [
  "Configures a basic Ethernet interface with a static IPv4 address and sets it to the 'up' state.",
  "Defines a bond interface in active-backup mode with two member interfaces, a static IPv4 address, and a specified MIIMON interval.",
  "Sets up a VLAN interface on top of an existing Ethernet interface with a specific VLAN ID and enables DHCP for IPv4.",
  "Describes the desired DNS resolver configuration, including search domains and server IP addresses.",
  "Specifies a static route for a particular destination subnet, defining the next-hop address and outgoing interface.",
  "Configures a Linux bridge interface with multiple member ports and enables Spanning Tree Protocol (STP).",
  "Creates a VXLAN interface with a specific VXLAN ID (VNI), a remote VTEP IP address, and sets the underlying physical interface.",
  "Defines an interface to be in the 'absent' state, effectively removing its configuration.",
  "Configures an Ethernet interface to obtain an IPv4 address automatically via DHCP, also enabling automatic gateway and DNS.",
  "Sets up an OVS (Open vSwitch) bridge with specified ports and OVS-specific options.",
  "Describes an Ethernet interface with both static IPv4 and IPv6 addresses.",
  "Configures a dummy interface with a specific name and brings it 'up'.",
  "Defines a MACVLAN interface in bridge mode, linked to a parent Ethernet interface, with a static IPv4 address.",
  "Specifies LACP rate and hashing policy for an 802.3ad bond interface.",
  "Configures interface-specific routing rules, for example, to direct traffic from a specific source IP range through a particular table.",
  "Disables IPv6 entirely for a specific interface while configuring a static IPv4 address.",
  "Sets an MTU (Maximum Transmission Unit) value for an Ethernet interface.",
  "Configures an interface with LLDP (Link Layer Discovery Protocol) enabled to emit and receive LLDPDU.",
  "Defines a desired state where a specific Ethernet interface should be 'down' or 'disabled'.",
  "Specifies advanced Ethernet options like ethtool features (e.g., TSO, GSO) for an interface.",
];

const nmstateYamlConfigurations = [
  `interfaces:
  - name: eth1
    type: ethernet
    state: up
    ipv4:
      enabled: true
      address:
        - ip: 192.168.1.100
          prefix-length: 24
      dhcp: false
      gateway: 192.168.1.1`,

  `interfaces:
  - name: bond0
    type: bond
    state: up
    link-aggregation:
      mode: active-backup
      miimon: 100
    port:
      - eth1
      - eth2
    ipv4:
      enabled: true
      address:
        - ip: 10.0.0.50
          prefix-length: 24
      dhcp: false`,

  `interfaces:
  - name: eth0.100
    type: vlan
    state: up
    vlan:
      base-iface: eth0
      id: 100
    ipv4:
      enabled: true
      dhcp: true`,

  `dns-resolver:
  config:
    search:
      - example.com
      - my.domain
    server:
      - 8.8.8.8
      - 1.1.1.1`,

  `routes:
  config:
    - destination: 172.16.0.0/16
      next-hop-address: 192.168.1.254
      next-hop-interface: eth1`,

  `interfaces:
  - name: br0
    type: linux-bridge
    state: up
    bridge:
      port:
        - name: eth2
        - name: eth3
      options:
        stp:
          enabled: true`,

  `interfaces:
  - name: vxlan10
    type: vxlan
    state: up
    vxlan:
      id: 10
      base-iface: eth0
      remote: 192.168.5.50
      destination-port: 4789`,

  `interfaces:
  - name: eth_to_remove
    type: ethernet
    state: absent`,

  `interfaces:
  - name: eth0
    type: ethernet
    state: up
    ipv4:
      enabled: true
      dhcp: true
      auto-dns: true
      auto-gateway: true`,

  `interfaces:
  - name: ovsbr0
    type: ovs-bridge
    state: up
    bridge:
      port:
        - name: eth1
        - name: tap0
    ovs-db:
      external_ids:
        bridge-id: myOvsBridge`,

  `interfaces:
  - name: eth0
    type: ethernet
    state: up
    ipv4:
      enabled: true
      address:
        - ip: 192.168.1.15
          prefix-length: 24
      dhcp: false
    ipv6:
      enabled: true
      address:
        - ip: 2001:db8:1::15
          prefix-length: 64
      dhcp: false`,

  `interfaces:
  - name: dummy0
    type: dummy
    state: up`,

  `interfaces:
  - name: macvlan0
    type: macvlan
    state: up
    macvlan:
      base-iface: eth0
      mode: bridge
    ipv4:
      enabled: true
      address:
        - ip: 192.168.10.5
          prefix-length: 24
      dhcp: false`,

  `interfaces:
  - name: bond1
    type: bond
    state: up
    link-aggregation:
      mode: 802.3ad
      options:
        lacp_rate: fast
        xmit_hash_policy: layer2+3
    port:
      - eth4
      - eth5`,

  `routes:
  rules:
    - ip-from: 192.168.20.0/24
      table: 100`,

  `interfaces:
  - name: eth0
    type: ethernet
    state: up
    ipv4:
      enabled: true
      address:
        - ip: 10.10.10.10
          prefix-length: 24
      dhcp: false
    ipv6:
      enabled: false`,

  `interfaces:
  - name: eth0
    type: ethernet
    state: up
    mtu: 9000`,

  `interfaces:
  - name: eth0
    type: ethernet
    state: up
    lldp:
      enabled: true`,

  `interfaces:
  - name: eth_to_disable
    type: ethernet
    state: down`,

  `interfaces:
  - name: eth0
    type: ethernet
    state: up
    ethtool:
      feature:
        tcp-segmentation-offload:
          rx: true
          tx: true
        generic-segmentation-offload:
          rx: true
          tx: true`
];

function getRandomInteger(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// mock API for now
async function validateSchema(schema: string) {
  console.log("Simulating network delay 500ms...");
  await new Promise(resolve => setTimeout(resolve, 500));
  return getRandomInteger(0, 1) === 1;
}

async function getNextReview(): Promise<NmstateReviewData> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    nmstateYaml: "dummy",
    description: "string",
    vote: 'yes',
  }
}

export { validateSchema }
