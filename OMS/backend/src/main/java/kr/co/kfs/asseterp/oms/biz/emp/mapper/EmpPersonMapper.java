package kr.co.kfs.asseterp.oms.biz.emp.mapper;

import kr.co.kfs.asseterp.oms.biz.emp.dto.PersonKey;
import kr.co.kfs.asseterp.oms.biz.emp.dto.PersonRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.PersonRow;
import kr.co.kfs.asseterp.oms.biz.emp.dto.UserInfoRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.UserInfoSearchParam;
import kr.co.kfs.asseterp.oms.biz.emp.dto.OnlinePersonParam;
import kr.co.kfs.asseterp.oms.biz.emp.dto.OnlinePersonRes;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

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

    /** 접속 중 사원 (회사·검색어 조건) */
    List<OnlinePersonRes> searchOnlinePersons(OnlinePersonParam param);
}
