package kr.co.kfs.asseterp.oms.biz.emp.mapper;

import kr.co.kfs.asseterp.oms.biz.emp.dto.PersonKey;
import kr.co.kfs.asseterp.oms.biz.emp.dto.PersonRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.PersonRow;
import kr.co.kfs.asseterp.oms.biz.emp.dto.UserInfoRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.UserInfoSearchParam;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface EmpPersonMapper {
    Long selectNextId();

    /** 로그인 회사의 사원 */
    PersonRes selectById(PersonKey key);

    int insert(PersonRow row);

    int update(PersonRow row);

    int delete(PersonKey key);

    /** 사용자정보 페이지 (전 고객사) */
    java.util.List<UserInfoRes> searchUserInfos(UserInfoSearchParam param);

    long countUserInfos(UserInfoSearchParam param);
}
