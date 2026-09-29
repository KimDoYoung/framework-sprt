package com.asseterp.security.biz.user.mapper;

import com.asseterp.security.biz.user.entity.AppUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface AppUserMapper {
    Optional<AppUser> findByUsername(@Param("username") String username);
    Optional<AppUser> findById(@Param("userId") Long userId);
    List<AppUser> findAll();
    int updateLockYn(@Param("userId") Long userId, @Param("lockYn") String lockYn);
}
