local diff = {
	["keyDiffs"] = {
		["d84pnilu85cdnilvdnilvpnilvunil"] = { ["name"] = "Gun fire", ["added"] = { [1] = { ["key"] = "JOY_BTN7" } } },
		["d350pnilu351cdnilvdnilvpnilvunil"] = { ["name"] = "Weapon release", ["added"] = { [1] = { ["key"] = "JOY_BTN8" } } },
		["d74pnilu75cdnilvdnilvpnilvunil"] = { ["name"] = "Wheel brake Both", ["added"] = { [1] = { ["key"] = "JOY_BTN3" } } },
		["d3004pnilunilcd12vd0.1vpnilvunil"] = { ["name"] = "Landing Gear Down", ["added"] = { [1] = { ["key"] = "JOY_BTN2" } } },
		["d3004pnilunilcd12vd0.2vpnilvunil"] = { ["name"] = "Landing Gear Up", ["added"] = { [1] = { ["key"] = "JOY_BTN1" } } },
		["d3002pnilunilcd12vd1vpnilvunil"] = { ["name"] = "Flaps Up", ["added"] = { [1] = { ["key"] = "JOY_BTN6" } } },
		["d3002pnilunilcd12vd0vpnilvunil"] = { ["name"] = "Flaps Down", ["added"] = { [1] = { ["key"] = "JOY_BTN4" } } },
		["d3003pnilunilcd1vd0vpnilvunil"] = { ["name"] = "Gunsight mode FIXED", ["added"] = { [1] = { ["key"] = "JOY_BTN11" } } },
		["d3003pnilunilcd1vd0.1vpnilvunil"] = { ["name"] = "Gunsight mode FIXED GYRO", ["added"] = { [1] = { ["key"] = "JOY_BTN10" } } },
		["d3003pnilunilcd1vd0.2vpnilvunil"] = { ["name"] = "Gunsight mode GYRO", ["added"] = { [1] = { ["key"] = "JOY_BTN9" } } },
		["d3007pnilunilcd13vd0vpnilvunil"] = { ["name"] = "Gun safety switch OFF", ["added"] = { [1] = { ["key"] = "JOY_BTN14" } } },
		["d3007pnilunilcd13vd1vpnilvunil"] = { ["name"] = "Gun safety switch GUN CAMERA SIGHT", ["added"] = { [1] = { ["key"] = "JOY_BTN13" } } },
		["d3007pnilunilcd13vd-1vpnilvunil"] = { ["name"] = "Gun safety switch CAMERA SIGHT", ["added"] = { [1] = { ["key"] = "JOY_BTN12" } } },
	},
	["axisDiffs"] = {
		["a2001cdnil"] = {
			["changed"] = {
				[1] = {
					["filter"] = {
						["curvature"] = {
							[1] = 0.26,
						},
						["deadzone"] = 0,
						["hardwareDetent"] = false,
						["hardwareDetentAB"] = 0,
						["hardwareDetentMax"] = 0,
						["invert"] = true,
						["saturationX"] = 1,
						["saturationY"] = 1,
						["slider"] = false,
					},
					["key"] = "JOY_Y",
				},
			},
			["name"] = "Pitch",
		},
		["a2002cdnil"] = {
			["added"] = {
				[1] = {
					["filter"] = {
						["curvature"] = {
							[1] = 0.33,
						},
						["deadzone"] = 0,
						["hardwareDetent"] = false,
						["hardwareDetentAB"] = 0,
						["hardwareDetentMax"] = 0,
						["invert"] = false,
						["saturationX"] = 1,
						["saturationY"] = 1,
						["slider"] = false,
					},
					["key"] = "JOY_RX",
				},
			},
			["name"] = "Roll",
			["removed"] = {
				[1] = {
					["key"] = "JOY_X",
				},
			},
		},
		["a2003cdnil"] = {
			["added"] = {
				[1] = {
					["filter"] = {
						["curvature"] = {
							[1] = 0.31,
						},
						["deadzone"] = 0,
						["hardwareDetent"] = false,
						["hardwareDetentAB"] = 0,
						["hardwareDetentMax"] = 0,
						["invert"] = false,
						["saturationX"] = 1,
						["saturationY"] = 1,
						["slider"] = false,
					},
					["key"] = "JOY_X",
				},
			},
			["name"] = "Rudder",
			["removed"] = {
				[1] = {
					["key"] = "JOY_RZ",
				},
			},
		},
		["a3025cd5"] = {
			["changed"] = {
				[1] = {
					["filter"] = {
						["curvature"] = {
							[1] = -0.01,
						},
						["deadzone"] = 0,
						["hardwareDetent"] = false,
						["hardwareDetentAB"] = 0,
						["hardwareDetentMax"] = 0,
						["invert"] = true,
						["saturationX"] = 1,
						["saturationY"] = 1,
						["slider"] = false,
					},
					["key"] = "JOY_Z",
				},
			},
			["name"] = "Throttle",
		},
	},
}
return diff