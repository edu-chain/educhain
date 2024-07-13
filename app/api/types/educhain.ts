/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/educhain.json`.
 */
export type Educhain = {
  "address": "7uHVPsgHpFmUCndwyBWA3wUF6jwmf6NX4UirwvJSbAZH",
  "metadata": {
    "name": "educhain",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "acceptGroupSwap",
      "discriminator": [
        154,
        230,
        30,
        51,
        18,
        201,
        214,
        123
      ],
      "accounts": [
        {
          "name": "course",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  114,
                  115,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "course.school",
                "account": "courseDataAccount"
              },
              {
                "kind": "account",
                "path": "course.id",
                "account": "courseDataAccount"
              }
            ]
          }
        },
        {
          "name": "swapRequest",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  119,
                  97,
                  112,
                  95,
                  114,
                  101,
                  113,
                  117,
                  101,
                  115,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "course"
              },
              {
                "kind": "account",
                "path": "swap_request.subscription",
                "account": "groupSwapRequestDataAccount"
              },
              {
                "kind": "account",
                "path": "swap_request.student",
                "account": "groupSwapRequestDataAccount"
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "signerGroup",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  114,
                  111,
                  117,
                  112
                ]
              },
              {
                "kind": "account",
                "path": "course.school",
                "account": "courseDataAccount"
              },
              {
                "kind": "account",
                "path": "course.id",
                "account": "courseDataAccount"
              },
              {
                "kind": "account",
                "path": "signer_group.id",
                "account": "groupDataAccount"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "addStudentToGroup",
      "discriminator": [
        133,
        236,
        254,
        230,
        24,
        60,
        217,
        240
      ],
      "accounts": [
        {
          "name": "course",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  114,
                  115,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "course.school",
                "account": "courseDataAccount"
              },
              {
                "kind": "account",
                "path": "course.id",
                "account": "courseDataAccount"
              }
            ]
          }
        },
        {
          "name": "subscription",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  115,
                  99,
                  114,
                  105,
                  112,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "course"
              },
              {
                "kind": "account",
                "path": "subscription.student",
                "account": "studentSubscriptionDataAccount"
              }
            ]
          }
        },
        {
          "name": "group",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  114,
                  111,
                  117,
                  112
                ]
              },
              {
                "kind": "account",
                "path": "course.school",
                "account": "courseDataAccount"
              },
              {
                "kind": "account",
                "path": "course.id",
                "account": "courseDataAccount"
              },
              {
                "kind": "account",
                "path": "group.id",
                "account": "groupDataAccount"
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "createCourse",
      "discriminator": [
        120,
        121,
        154,
        164,
        107,
        180,
        167,
        241
      ],
      "accounts": [
        {
          "name": "school",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  99,
                  104,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "course",
          "writable": true
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "courseAdmins",
          "type": {
            "vec": "pubkey"
          }
        }
      ]
    },
    {
      "name": "createGroup",
      "discriminator": [
        79,
        60,
        158,
        134,
        61,
        199,
        56,
        248
      ],
      "accounts": [
        {
          "name": "course",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  114,
                  115,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "course.school",
                "account": "courseDataAccount"
              },
              {
                "kind": "account",
                "path": "course.id",
                "account": "courseDataAccount"
              }
            ]
          }
        },
        {
          "name": "group",
          "writable": true
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createSession",
      "discriminator": [
        242,
        193,
        143,
        179,
        150,
        25,
        122,
        227
      ],
      "accounts": [
        {
          "name": "school",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  99,
                  104,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "course",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  114,
                  115,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "school"
              },
              {
                "kind": "account",
                "path": "course.id",
                "account": "courseDataAccount"
              }
            ]
          }
        },
        {
          "name": "session",
          "writable": true
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "start",
          "type": "u64"
        },
        {
          "name": "end",
          "type": "u64"
        }
      ]
    },
    {
      "name": "groupSwapRequest",
      "discriminator": [
        185,
        149,
        115,
        7,
        41,
        1,
        243,
        193
      ],
      "accounts": [
        {
          "name": "course",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  114,
                  115,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "course.school",
                "account": "courseDataAccount"
              },
              {
                "kind": "account",
                "path": "course.id",
                "account": "courseDataAccount"
              }
            ]
          }
        },
        {
          "name": "subscription",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  115,
                  99,
                  114,
                  105,
                  112,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "course"
              },
              {
                "kind": "account",
                "path": "subscription.student",
                "account": "studentSubscriptionDataAccount"
              }
            ]
          }
        },
        {
          "name": "requestedGroup",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  114,
                  111,
                  117,
                  112
                ]
              },
              {
                "kind": "account",
                "path": "course.school",
                "account": "courseDataAccount"
              },
              {
                "kind": "account",
                "path": "course.id",
                "account": "courseDataAccount"
              },
              {
                "kind": "account",
                "path": "requested_group.id",
                "account": "groupDataAccount"
              }
            ]
          }
        },
        {
          "name": "swapRequest",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  119,
                  97,
                  112,
                  95,
                  114,
                  101,
                  113,
                  117,
                  101,
                  115,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "subscription.course",
                "account": "studentSubscriptionDataAccount"
              },
              {
                "kind": "account",
                "path": "subscription"
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeSchool",
      "discriminator": [
        143,
        96,
        246,
        21,
        93,
        250,
        28,
        111
      ],
      "accounts": [
        {
          "name": "school",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  99,
                  104,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "studentAttendance",
      "discriminator": [
        165,
        17,
        120,
        203,
        148,
        244,
        69,
        107
      ],
      "accounts": [
        {
          "name": "course",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  114,
                  115,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "course.school",
                "account": "courseDataAccount"
              },
              {
                "kind": "account",
                "path": "course.id",
                "account": "courseDataAccount"
              }
            ]
          }
        },
        {
          "name": "subscription",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  115,
                  99,
                  114,
                  105,
                  112,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "subscription.course",
                "account": "studentSubscriptionDataAccount"
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "session",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  101,
                  115,
                  115,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "course.school",
                "account": "courseDataAccount"
              },
              {
                "kind": "account",
                "path": "course.id",
                "account": "courseDataAccount"
              },
              {
                "kind": "account",
                "path": "session.id",
                "account": "sessionDataAccount"
              }
            ]
          }
        },
        {
          "name": "attendance",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  116,
                  116,
                  101,
                  110,
                  100,
                  97,
                  110,
                  99,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "session"
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "studentSubscription",
      "discriminator": [
        37,
        36,
        6,
        142,
        135,
        183,
        67,
        218
      ],
      "accounts": [
        {
          "name": "course",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  117,
                  114,
                  115,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "course.school",
                "account": "courseDataAccount"
              },
              {
                "kind": "account",
                "path": "course.id",
                "account": "courseDataAccount"
              }
            ]
          }
        },
        {
          "name": "subscription",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  115,
                  99,
                  114,
                  105,
                  112,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "course"
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "courseDataAccount",
      "discriminator": [
        132,
        186,
        3,
        126,
        136,
        64,
        187,
        220
      ]
    },
    {
      "name": "groupDataAccount",
      "discriminator": [
        219,
        0,
        239,
        24,
        210,
        136,
        62,
        244
      ]
    },
    {
      "name": "groupSwapRequestDataAccount",
      "discriminator": [
        49,
        160,
        178,
        142,
        235,
        70,
        76,
        229
      ]
    },
    {
      "name": "schoolDataAccount",
      "discriminator": [
        26,
        29,
        213,
        19,
        154,
        228,
        31,
        136
      ]
    },
    {
      "name": "sessionDataAccount",
      "discriminator": [
        141,
        49,
        107,
        170,
        196,
        65,
        205,
        39
      ]
    },
    {
      "name": "studentAttendanceProofDataAccount",
      "discriminator": [
        212,
        180,
        208,
        24,
        45,
        43,
        143,
        58
      ]
    },
    {
      "name": "studentSubscriptionDataAccount",
      "discriminator": [
        109,
        25,
        2,
        51,
        19,
        57,
        195,
        182
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "exceedingMaximumAdmins",
      "msg": "Exceeding maximum admins count"
    },
    {
      "code": 6001,
      "name": "exceedingMaximumGroupMembers",
      "msg": "Exceeding maximum group members count"
    },
    {
      "code": 6002,
      "name": "onlyCourseAdminCanCreateGroup",
      "msg": "Only a course admin can create a group"
    },
    {
      "code": 6003,
      "name": "studentIsMemberOfAnotherGroup",
      "msg": "Student is member of another group"
    }
  ],
  "types": [
    {
      "name": "courseDataAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "school",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "admins",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "sessionsCounter",
            "type": "u64"
          },
          {
            "name": "groupsCounter",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "groupDataAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "course",
            "type": "pubkey"
          },
          {
            "name": "students",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "groupSwapRequestDataAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "student",
            "type": "pubkey"
          },
          {
            "name": "requestedGroup",
            "type": "pubkey"
          },
          {
            "name": "course",
            "type": "pubkey"
          },
          {
            "name": "subscription",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "schoolDataAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "coursesCounter",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "sessionDataAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "course",
            "type": "pubkey"
          },
          {
            "name": "start",
            "type": "u64"
          },
          {
            "name": "end",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "studentAttendanceProofDataAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "student",
            "type": "pubkey"
          },
          {
            "name": "session",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "studentSubscriptionDataAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "course",
            "type": "pubkey"
          },
          {
            "name": "student",
            "type": "pubkey"
          },
          {
            "name": "group",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "active",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
