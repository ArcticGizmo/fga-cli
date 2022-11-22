type user
type file
  relations
    define can_read as owner or viewer
    define can_edit as owner
    define can_delete as owner
    define owner as self
    define viewer as self