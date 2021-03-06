# PublicUser
 ```
---
  type: "object"
  keys: 
    name: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 100
    role: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "adc"
        - "admin"
        - "admissionsclerk"
        - "chambers"
        - "clerkofcourt"
        - "docketclerk"
        - "floater"
        - "inactivePractitioner"
        - "irsPractitioner"
        - "irsSuperuser"
        - "judge"
        - "petitioner"
        - "petitionsclerk"
        - "privatePractitioner"
        - "trialclerk"
    judgeFullName: 
      type: "any"
      whens: 
        - 
          ref: 
            path: 
              - "role"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - "judge"
          then: 
            type: "string"
            flags: 
              presence: "optional"
            rules: 
              - 
                name: "max"
                args: 
                  limit: 100
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null
    judgeTitle: 
      type: "any"
      whens: 
        - 
          ref: 
            path: 
              - "role"
          is: 
            type: "any"
            flags: 
              only: true
              presence: "required"
            allow: 
              - 
                override: true
              - "judge"
          then: 
            type: "string"
            flags: 
              presence: "optional"
            rules: 
              - 
                name: "max"
                args: 
                  limit: 100
          otherwise: 
            type: "any"
            flags: 
              presence: "optional"
            allow: 
              - null

 ```
