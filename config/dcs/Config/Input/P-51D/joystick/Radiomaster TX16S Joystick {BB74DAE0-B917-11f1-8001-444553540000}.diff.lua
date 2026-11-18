local diff = {
	["keyDiffs"] = {
		["d84pnilu85cdnilvdnilvpnilvunil"] = { ["name"] = "Gun fire", ["removed"] = { [1] = { ["key"] = "JOY_BTN1" } }, ["added"] = { [1] = { ["key"] = "JOY_BTN7" } } },
		["d350pnilu351cdnilvdnilvpnilvunil"] = { ["name"] = "Weapon release", ["removed"] = { [1] = { ["key"] = "JOY_BTN2" } }, ["added"] = { [1] = { ["key"] = "JOY_BTN8" } } },
		["d74pnilu75cdnilvdnilvpnilvunil"] = { ["name"] = "Wheel brake Both", ["added"] = { [1] = { ["key"] = "JOY_BTN3" } } },
		["d3004pnilunilcd12vd0.1vpnilvunil"] = { ["name"] = "Landing Gear Down", ["added"] = { [1] = { ["key"] = "JOY_BTN2" } } },
		["d3004pnilunilcd12vd0.2vpnilvunil"] = { ["name"] = "Landing Gear Up", ["added"] = { [1] = { ["key"] = "JOY_BTN1" } } },
		["d3003pnilunilcd1vd0vpnilvunil"] = { ["name"] = "Gunsight mode FIXED", ["added"] = { [1] = { ["key"] = "JOY_BTN11" } } },
		["d3003pnilunilcd1vd0.1vpnilvunil"] = { ["name"] = "Gunsight mode FIXED GYRO", ["added"] = { [1] = { ["key"] = "JOY_BTN10" } } },
		["d3003pnilunilcd1vd0.2vpnilvunil"] = { ["name"] = "Gunsight mode GYRO", ["added"] = { [1] = { ["key"] = "JOY_BTN9" } } },
		["d3007pnilunilcd13vd0vpnilvunil"] = { ["name"] = "Gun safety switch OFF", ["added"] = { [1] = { ["key"] = "JOY_BTN14" } } },
		["d3007pnilunilcd13vd1vpnilvunil"] = { ["name"] = "Gun safety switch GUN CAMERA SIGHT", ["added"] = { [1] = { ["key"] = "JOY_BTN13" } } },
		["d3007pnilunilcd13vd-1vpnilvunil"] = { ["name"] = "Gun safety switch CAMERA SIGHT", ["added"] = { [1] = { ["key"] = "JOY_BTN12" } } },
		["d3001pnilu3001cd5vd0.1vpnilvu0"] = { ["name"] = "Radiator coolant Close", ["added"] = { [1] = { ["key"] = "JOY_BTN21" } } },
		["d3009pnilunilcd5vd0.2vpnilvunil"] = { ["name"] = "Radiator coolant Auto", ["added"] = { [1] = { ["key"] = "JOY_BTN22" } } },
		["d3001pnilu3001cd5vd0.3vpnilvu0"] = { ["name"] = "Radiator coolant Open", ["added"] = { [1] = { ["key"] = "JOY_BTN23" } } },
		["d179pnilunilcdnilvdnilvpnilvunil"] = { ["name"] = "COMM Communication menu", ["added"] = { [1] = { ["key"] = "JOY_BTN25" } } },
	},

	["axisDiffs"] = {
		["a3017cd12"] = { ["name"] = "Flaps", ["added"] = { [1] = { ["key"] = "JOY_SLIDER1", ["filter"] = { ["curvature"] = { [1] = 0 }, ["deadzone"] = 0, ["invert"] = false, ["saturationX"] = 1, ["saturationY"] = 1, ["slider"] = false } } } },
		["a3026cd5"] = { ["name"] = "Engine RPM Setting", ["added"] = { [1] = { ["key"] = "JOY_RZ", ["filter"] = { ["curvature"] = { [1] = 0 }, ["deadzone"] = 0, ["invert"] = true, ["saturationX"] = 1, ["saturationY"] = 1, ["slider"] = false } } } },
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