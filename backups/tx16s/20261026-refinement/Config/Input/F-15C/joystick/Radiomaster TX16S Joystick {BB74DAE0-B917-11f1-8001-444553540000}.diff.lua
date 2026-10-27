local diff = {
	["keyDiffs"] = {
		["d84pnilu85cdnilvdnilvpnilvunil"] = { ["name"] = "Weapon Fire", ["added"] = { [1] = { ["key"] = "JOY_BTN7" } } },
		["d350pnilu351cdnilvdnilvpnilvunil"] = { ["name"] = "Weapon Release", ["added"] = { [1] = { ["key"] = "JOY_BTN8" } } },
		["d74pnilu75cdnilvdnilvpnilvunil"] = { ["name"] = "Wheel Brake On", ["added"] = { [1] = { ["key"] = "JOY_BTN3" } } },
		["d431pnilunilcdnilvdnilvpnilvunil"] = { ["name"] = "Landing Gear Down", ["added"] = { [1] = { ["key"] = "JOY_BTN2" } } },
		["d430pnilunilcdnilvdnilvpnilvunil"] = { ["name"] = "Landing Gear Up", ["added"] = { [1] = { ["key"] = "JOY_BTN1" } } },
		["d146pnilunilcdnilvdnilvpnilvunil"] = { ["name"] = "Flaps Up", ["added"] = { [1] = { ["key"] = "JOY_BTN6" } } },
		["d145pnilunilcdnilvdnilvpnilvunil"] = { ["name"] = "Flaps Landing Position", ["added"] = { [1] = { ["key"] = "JOY_BTN4" } } },
		["d106pnilunilcdnilvdnilvpnilvunil"] = { ["name"] = "(2) Beyond Visual Range Mode", ["added"] = { [1] = { ["key"] = "JOY_BTN11" } } },
		["d107pnilunilcdnilvdnilvpnilvunil"] = { ["name"] = "(3) Close Air Combat Vertical Scan Mode", ["added"] = { [1] = { ["key"] = "JOY_BTN10" } } },
		["d108pnilunilcdnilvdnilvpnilvunil"] = { ["name"] = "(4) Close Air Combat Bore Mode", ["added"] = { [1] = { ["key"] = "JOY_BTN9" } } },
		["d113pnilunilcdnilvdnilvpnilvunil"] = { ["name"] = "Cannon", ["added"] = { [1] = { ["key"] = "JOY_BTN14" } } },
		["d101pnilunilcdnilvdnilvpnilvunil"] = { ["name"] = "Change Weapon", ["added"] = { [1] = { ["key"] = "JOY_BTN13" } } },
		["d408pnilunilcdnilvdnilvpnilvunil"] = { ["name"] = "Autopilot Disengage", ["added"] = { [1] = { ["key"] = "JOY_BTN17" } } },
		["d389pnilunilcdnilvdnilvpnilvunil"] = { ["name"] = "Autopilot - Altitude Hold", ["added"] = { [1] = { ["key"] = "JOY_BTN16" } } },
		["d62pnilunilcdnilvdnilvpnilvunil"] = { ["name"] = "Autopilot - Attitude Hold", ["added"] = { [1] = { ["key"] = "JOY_BTN15" } } },
	},
	["axisDiffs"] = {
		["a2001cdnil"] = {
			["changed"] = {
				[1] = {
					["filter"] = {
						["curvature"] = {
							[1] = 0,
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
		["a2004cdnil"] = {
			["changed"] = {
				[1] = {
					["filter"] = {
						["curvature"] = {
							[1] = 0,
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
			["name"] = "Thrust",
		},
	},
}
return diff