export const getCreateResourcesManifest = (accountAddress) => `
CREATE_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY
  None
  false
  18u8
  Decimal("100000000000")
  Tuple(
      None,
      Some(
          Tuple(
              Some(Enum<AccessRule::AllowAll>()),
              Some(Enum<AccessRule::DenyAll>())
          )
      ),
      None,
      None,
      None,
      None
  )
  Tuple(
      Map<String, Tuple>(
          "name" => Tuple(
              Some(Enum<Metadata::String>("Token A")),
              true
          ),
          "symbol" => Tuple(Some(Enum<Metadata::String>("A")),
              true
          ),
          "description" => Tuple(Some(Enum<Metadata::String>(
                      "A test token."
                  )),
              true
          ),
      ),
      Map<String, Enum>()
  )
  None;
CREATE_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY
  None
  false
  18u8
  Decimal("100000000000")
  Tuple(
      None,
      Some(
          Tuple(
              Some(Enum<AccessRule::AllowAll>()),
              Some(Enum<AccessRule::DenyAll>())
          )
      ),
      None,
      None,
      None,
      None
  )
  Tuple(
      Map<String, Tuple>(
          "name" => Tuple(
              Some(Enum<Metadata::String>("Token B")),
              true
          ),
          "symbol" => Tuple(Some(Enum<Metadata::String>("B")),
              true
          ),
          "description" => Tuple(Some(Enum<Metadata::String>(
                      "A test token."
                  )),
              true
          ),
      ),
      Map<String, Enum>()
  )
  None;
CALL_METHOD
  Address("${accountAddress}")
  "deposit_batch"
  Expression("ENTIRE_WORKTOP");
`;
