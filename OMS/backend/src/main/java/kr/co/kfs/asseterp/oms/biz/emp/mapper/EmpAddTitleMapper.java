package kr.co.kfs.asseterp.oms.biz.emp.mapper;

import kr.co.kfs.asseterp.oms.biz.emp.dto.AddTitleRes;
import kr.co.kfs.asseterp.oms.biz.emp.dto.AddTitleRow;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface EmpAddTitleMapper {
    Long selectNextId();

    List<AddTitleRes> searchByPersonId(Long personId);

    AddTitleRes selectById(Long addTitleId);

    int insert(AddTitleRow row);

    int update(AddTitleRow row);

    int delete(Long addTitleId);
}
